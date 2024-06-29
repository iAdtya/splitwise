import express from "express";
import {
  users,
  InsertUser,
  SelectUser,
  InsertExpense,
  expenses,
  balances,
  InsertBalance,
  SelectBalance,
} from "./db/schema";
import { db } from "./db/db";
import { eq, inArray } from "drizzle-orm";

export const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Hello World - NLW04" });
});

app.post("/users", async (req, res) => {
  try {
    const createUser: InsertUser = {
      email: req.body.email,
      password: req.body.password,
      default_currency: req.body.default_currency,
    };
    const user = await db.insert(users).values(createUser).returning({
      email: users.email,
      default_currency: users.default_currency,
    });
    console.log(user);
    return res.json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.post("/update_user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const updateUser = {
      email: req.body.email,
      default_currency: req.body.default_currency,
    };

    const user_update = await db
      .update(users)
      .set(updateUser)
      .where(eq(users.id, userId));

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.delete("/delete_user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const user_deletion = await db.delete(users).where(eq(users.id, userId));

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.post("/expense/", async (req, res) => {
  try {
    const memberEmails: string[] = req.body.members;

    const memberUsers = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(inArray(users.email, memberEmails));

    const existingEmails = memberUsers.map((user) => user.email);
    const nonExistingEmails = memberEmails.filter(
      (email) => !existingEmails.includes(email)
    );

    if (nonExistingEmails.length > 0) {
      return res.status(400).json({
        error: "Some emails are not registered",
        nonExistingEmails: nonExistingEmails,
      });
    }

    // If all emails exist, proceed with inserting the expense
    const expenseData: InsertExpense = {
      name: req.body.name,
      value: req.body.value,
      currency: req.body.currency,
      members: req.body.members,
      date: req.body.date,
      user_id: req.body.user_id,
    };

    const newExpense = await db.insert(expenses).values(expenseData);

    // Calculate the balance for each member
    const balance = (
      Number(expenseData.value) / expenseData.members.length
    ).toFixed(2);

    // Create balance entries for each member
    const balanceInserts = memberUsers.map((member) => ({
      user_id: expenseData.user_id,
      balance_with_user_id: member.id,
      balance_amount: member.id === expenseData.user_id ? "0" : balance,
    }));

    await db.insert(balances).values(balanceInserts);

    return res.json({ message: "Expense created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.get("/expense/:user_id", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);
    const expensesList = await db
      .select({
        name: expenses.name,
        value: expenses.value,
        currency: expenses.currency,
      })
      .from(expenses)
      .where(eq(expenses.user_id, userId));

    return res.json({ expenses: expensesList });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.put("/expense_update/:id", async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id, 10);

    const updatedExpense = {
      value: req.body.value,
      currency: req.body.currency,
    };

    const updatedRecord = await db
      .update(expenses)
      .set(updatedExpense)
      .where(eq(expenses.id, expenseId));

    return res.json({ updatedExpense: updatedRecord });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.delete("/expense_delete/:id", async (req, res) => {
  try {
    const expenseId = parseInt(req.params.id, 10);
    await db.delete(expenses).where(eq(expenses.id, expenseId));
    return res
      .status(200)
      .json({ message: `Expense deleted successfully for id ${expenseId}` });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.get("/balances/:user_id", async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);
    const userBalances = await db
      .select({
        balance_with_user_id: balances.balance_with_user_id,
        balance_amount: balances.balance_amount,
      })
      .from(balances)
      .where(eq(balances.user_id, userId));
    return res.status(200).json({ balances: userBalances });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      // Handle the case where error is not an Error instance
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
