import Expense from "../middleware/expenseModel.js";

export async function createExpense(req, res) {
    try {
        const { amount, date, note, category } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be greater than zero" });
        }
        const expense = new Expense({
            amount,
            date: date ? new Date(date) : new Date(),
            note: note || '',
            category: category || 'Other',
            owner: req.user._id
        });
        const saved = await expense.save();
        res.status(201).json({ success: true, expense: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getExpenses = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;
        const filter = { owner: req.user._id };
        if (category) {
            filter.category = category;
        }
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }
        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.status(200).json({ success: true, expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, owner: req.user._id });
        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.status(200).json({ success: true, expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const data = {...req.body};
        if (data.amount !== undefined && data.amount <= 0) {
            return res.status(400).json({ success: false, message: "Amount must be greater than zero" });
        }
        if (data.date) {
            data.date = new Date(data.date);
        }
        const updated = await Expense.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            data,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.status(200).json({ success: true, expense: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }
        res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Summary report: total spent, group by category, group by month
export const getSummary = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const summary = await Expense.aggregate([
            { $match: { owner: ownerId } },
            {
                $facet: {
                    totalSpent: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
                    byCategory: [
                        { $group: { _id: "$category", total: { $sum: "$amount" } } },
                        { $sort: { total: -1 } }
                    ],
                    byMonth: [
                        {
                            $group: {
                                _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                                total: { $sum: "$amount" }
                            }
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } }
                    ]
                }
            }
        ]);
        res.status(200).json({ success: true, summary: summary[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


