const CustomTour = require('../models/CustomTour');

const DEFAULT_PREFERENCE = 'budget';
const VALID_PREFERENCES = new Set(['budget', 'balanced', 'premium']);

function getComponentPrice(component, people, days) {
    if (component.price_per_day) {
        return Number(component.price_per_day) * days;
    }
    if (component.price_per_person) {
        return Number(component.price_per_person) * people;
    }
    return 0;
}

function pickByPreference(list, preference, people, days) {
    if (!list.length) return null;
    const sorted = [...list].sort((a, b) => getComponentPrice(a, people, days) - getComponentPrice(b, people, days));
    if (preference === 'premium') return sorted[sorted.length - 1];
    if (preference === 'balanced') return sorted[Math.floor(sorted.length / 2)];
    return sorted[0];
}

function allocateDays(totalDays, destinationCount) {
    const base = Math.floor(totalDays / destinationCount);
    const remainder = totalDays % destinationCount;
    return Array.from({ length: destinationCount }, (_, idx) => base + (idx < remainder ? 1 : 0));
}

const customTourController = {
    /**
     * POST /api/custom-tours/estimate
     */
    async estimate(req, res) {
        try {
            const {
                budget,
                people = 1,
                days = 1,
                destination_ids = [],
                hotel_star = null,
                preference = DEFAULT_PREFERENCE
            } = req.body || {};

            if (!budget || !Array.isArray(destination_ids) || destination_ids.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu budget hoặc destination_ids'
                });
            }

            const safePeople = Math.max(1, Number(people) || 1);
            const safeDays = Math.max(1, Number(days) || 1);
            const pref = VALID_PREFERENCES.has(preference) ? preference : DEFAULT_PREFERENCE;

            const components = await CustomTour.getComponents(destination_ids);

            const daysAllocation = allocateDays(safeDays, destination_ids.length);
            const plans = ['budget', 'balanced', 'premium'].map(mode => {
                let total = 0;
                const breakdown = [];
                const optionalItems = [];

                destination_ids.forEach((destId, index) => {
                    const destDays = daysAllocation[index] || 0;
                    const perDest = components.filter(c => c.destination_id === destId);
                    const globals = components.filter(c => c.destination_id === null);

                    const hotelPool = perDest.filter(c => c.type === 'hotel' && (hotel_star ? c.star_rating === Number(hotel_star) : true));
                    const transportPool = perDest.filter(c => c.type === 'transport');
                    const activityPool = perDest.filter(c => c.type === 'activity');
                    const mealPool = perDest.filter(c => c.type === 'meal');

                    const chosenHotel = pickByPreference(hotelPool, mode, safePeople, destDays || 1);
                    const chosenTransport = pickByPreference(transportPool, mode, safePeople, destDays || 1);
                    const chosenActivity = pickByPreference(activityPool, mode, safePeople, destDays || 1);
                    const chosenMeal = pickByPreference(mealPool, mode, safePeople, destDays || 1);

                    const items = [chosenHotel, chosenTransport, chosenActivity, chosenMeal].filter(Boolean);
                    const itemCosts = items.map(item => {
                        const cost = getComponentPrice(item, safePeople, destDays || 1);
                        if (item.is_optional) {
                            optionalItems.push({ destId, item, cost });
                        }
                        return { ...item, cost };
                    });

                    const destTotal = itemCosts.reduce((sum, i) => sum + i.cost, 0);
                    total += destTotal;

                    breakdown.push({
                        destination_id: destId,
                        days: destDays,
                        items: itemCosts,
                        total: destTotal
                    });

                    // add global optional add-ons once per destination
                    const globalAdds = globals.filter(c => c.type !== 'hotel');
                    if (globalAdds.length) {
                        const add = pickByPreference(globalAdds, mode, safePeople, destDays || 1);
                        if (add) {
                            const addCost = getComponentPrice(add, safePeople, destDays || 1);
                            optionalItems.push({ destId, item: add, cost: addCost });
                            total += addCost;
                            breakdown[breakdown.length - 1].items.push({ ...add, cost: addCost });
                            breakdown[breakdown.length - 1].total += addCost;
                        }
                    }
                });

                // Budget-first: remove optional items until within budget
                const removed = [];
                if (total > budget) {
                    optionalItems.sort((a, b) => b.cost - a.cost);
                    for (const opt of optionalItems) {
                        if (total <= budget) break;
                        total -= opt.cost;
                        removed.push({
                            destination_id: opt.destId,
                            name: opt.item.name,
                            cost: opt.cost
                        });
                    }
                }

                return {
                    plan: mode,
                    total_cost: total,
                    within_budget: total <= budget,
                    budget_gap: total <= budget ? 0 : total - budget,
                    removed_optional: removed,
                    breakdown
                };
            });

            res.json({
                success: true,
                data: {
                    budget,
                    people: safePeople,
                    days: safeDays,
                    destination_ids,
                    preference: pref,
                    plans
                }
            });
        } catch (error) {
            console.error('Custom tour estimate error:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tạo tour theo ngân sách',
                error: error.message
            });
        }
    }
};

module.exports = customTourController;
