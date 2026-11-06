import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini SDK safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasGeminiKey: hasKey,
    model: 'gemini-3.8-flash',
    project: 'AI FOR FINANCE CIA-2 - AetherFinance AI Bot',
  });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userProfile, userFinances } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.content || '';

    // Prepare system instructions with financial knowledge base + friendly companion persona
    const systemInstruction = `You are AetherBot, an elite, warm, highly intelligent AI Financial Advisor and friendly conversational companion developed for the "AI FOR FINANCE CIA-2: AI-Powered Financial Chatbot" project.

Your Persona & Capabilities:
1. Financial Expertise:
   - Budgeting: 50/30/20 rule, envelope budgeting, zero-based budgeting, reducing fixed leaks.
   - Savings: High-Yield Savings Accounts (HYSA), emergency fund sizing (3-6 months), automated saving habits.
   - Loans & Debt: Amortization math, EMI calculation, Debt Avalanche (highest interest first) vs Debt Snowball (lowest balance first), credit score optimization.
   - Investments: Dollar-cost averaging, low-cost index funds/ETFs, compound interest math, asset allocation, diversification, risk tolerance profiles.
   - Financial Planning: Retirement milestones, inflation hedging, tax-advantaged accounts (401k, Roth IRA).
2. Daily & Casual Conversation:
   - You are as fluent, helpful, articulate, and empathetic as Gemini or ChatGPT.
   - If the user asks about everyday topics (e.g. "How are you doing today?", "Tell me a joke", "What's the meaning of life?", "Recommend a productivity routine"), respond naturally, warmly, and cleverly with full conversational capability.
3. User Context:
   - User Name: ${userProfile?.name || 'Investor'}
   - User Email: ${userProfile?.email || 'user@gmail.com'}
   - Monthly Income: $${userFinances?.monthlyIncome || 5400}
   - Monthly Savings: $${userFinances?.monthlySavings || 1200}
   - Monthly Debt: $${userFinances?.monthlyDebt || 450}
   - Emergency Fund: ${userFinances?.emergencyMonths || 4} months
   - Investment Portfolio: $${userFinances?.portfolioValue || 28500}

Formatting Guidelines:
- Use clean Markdown with headers (##, ###), bullet points, bold key figures, and clear spacing.
- Keep tone professional yet approachable, motivating, and mathematically sound.
- If performing calculations, clearly write down the step-by-step numbers so the user can easily follow.`;

    const ai = getGeminiClient();

    if (!ai) {
      // High-grade intelligent local financial response fallback if key isn't provided
      const fallbackResponse = generateLocalFallbackResponse(userPrompt, userFinances);
      res.json({
        text: fallbackResponse,
        source: 'local_engine',
        notice: 'Running on integrated Financial Knowledge Engine. Connect your GEMINI_API_KEY in Settings > Secrets for continuous cloud inference.',
      });
      return;
    }

    // Format conversation history for Gemini multi-turn format
    // Map previous turns to contents
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'I analyzed your request. How else can I assist with your financial plan today?';

    res.json({
      text: replyText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: unknown) {
    console.error('Error generating AI response:', error);
    const err = error as { status?: number; message?: string };
    let cleanErrorMsg = 'temporary connection delay';
    if (err?.message) {
      try {
        const parsed = JSON.parse(err.message);
        cleanErrorMsg = parsed?.error?.message || err.message;
      } catch {
        cleanErrorMsg = err.message;
      }
    }
    
    // Provide graceful, professional advisory reply so user's experience is never disrupted
    res.json({
      text: `### Financial Advisory Guidance\n\n*Note: Cloud AI model is experiencing high demand (${cleanErrorMsg}). Here is your immediate financial guidance:*\n\n- **Core Principle**: When planning financial decisions, always preserve 3 to 6 months of living expenses in liquid reserves before committing to illiquid instruments.\n- **Action Step**: Check your 50/30/20 budget breakdown in the Dashboard to ensure your debt-to-income remains below 30%.\n\n*Feel free to ask a follow-up or check your loan calculation!*`,
      source: 'resilient_fallback',
      error: cleanErrorMsg,
    });
  }
});

// Fallback response engine for standard queries
function generateLocalFallbackResponse(query: string, finances: Record<string, number> | undefined): string {
  const q = query.toLowerCase();

  if (q.includes('budget') || q.includes('50/30/20')) {
    const inc = finances?.monthlyIncome || 5400;
    const needs = inc * 0.5;
    const wants = inc * 0.3;
    const savings = inc * 0.2;
    return `### 50/30/20 Budget Optimization Strategy

Based on your current monthly take-home income of **$${inc.toLocaleString()}**, here is your ideal budget allocation:

1. **50% Essentials & Needs ($${needs.toLocaleString()}/mo)**:
   - Rent/Mortgage, utilities, groceries, transportation, minimum debt payments, and basic healthcare.
2. **30% Discretionary Wants ($${wants.toLocaleString()}/mo)**:
   - Dining out, entertainment, subscriptions, hobbies, travel, and personal shopping.
3. **20% Savings & Wealth Building ($${savings.toLocaleString()}/mo)**:
   - High-Yield Savings Account (HYSA), emergency reserves, index funds (S&P 500 / Total Market), and retirement matching.

**Actionable Recommendation**: Automate your $${savings.toLocaleString()} transfer on the exact day your paycheck clears so you always "pay yourself first"!`;
  }

  if (q.includes('loan') || q.includes('emi') || q.includes('mortgage') || q.includes('debt')) {
    return `### Debt & Loan Amortization Advisory

When tackling loans and amortized debt, consider these two battle-tested strategies:

- **Debt Avalanche (Mathematical Winner)**:
  - Pay minimums on all obligations, and deploy every extra dollar to the loan with the **highest interest rate** (e.g. credit cards at 24% or personal loans).
  - *Benefit*: Saves the maximum total dollars in interest over the loan duration.
- **Debt Snowball (Behavioral Momentum)**:
  - Pay off the debt with the **smallest outstanding balance** first, regardless of interest.
  - *Benefit*: Delivers fast psychological wins and closes out trade lines quickly.

**Key Rule of Thumb**: Keep your total Debt-to-Income (DTI) ratio under **36%**, with no more than **28%** going toward housing.`;
  }

  if (q.includes('invest') || q.includes('stock') || q.includes('crypto') || q.includes('etf')) {
    return `### Wealth Building & Investment Framework

Building long-term wealth through investing relies on three mathematical pillars:

1. **Compound Interest & Time**:
   - Compounding works exponentially ($A = P(1 + r/n)^{nt}$). An investment of $500/month in a diversified index fund averaging 8% annually grows to **$294,000 in 20 years** and over **$745,000 in 30 years**.
2. **Broad Diversification**:
   - Rather than picking volatile single stocks, anchor your core portfolio in low-cost total market index funds or ETFs (such as VOO, VTI, or global market baskets) with expense ratios under 0.05%.
3. **Dollar-Cost Averaging (DCA)**:
   - Invest a fixed sum regularly regardless of market peaks or valleys. This eliminates emotional market timing errors and lowers average cost basis.`;
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
    return `### Hello! I'm AetherBot 🤖✨

I'm your intelligent AI Financial Advisor and personal companion! I can assist you with:

- 📊 **Budgeting & Spending Optimization** (50/30/20 analysis & expense audits)
- 💰 **Savings Growth & High-Yield Strategy** (Compound interest forecasting)
- 💳 **Loan Calculators & Debt Payoff Paths** (EMI calculation, Avalanche vs Snowball)
- 📈 **Investment Fundamentals** (Asset allocation, index funds, risk analysis)
- 💬 **Everyday Conversations & Questions** (Ask me anything you're curious about!)

You can chat with me via text or click the **Mic button** to talk with me in real-time Voice Assistant mode! What's on your mind today?`;
  }

  return `### Comprehensive Financial Analysis

Thank you for your question! Here are key financial takeaways regarding **"${query}"**:

1. **Strategic Foundation**: In personal finance, always verify your cash flow margin (Income minus Expenses) is positive before making major capital commitments.
2. **Risk Mitigation**: Maintain an emergency fund of 3 to 6 months of living expenses in an accessible, insured High-Yield Savings Account.
3. **Long-Term Compounding**: Direct surplus cash into diversified, tax-advantaged accounts to maximize exponential compound returns.

Feel free to ask for a specific calculation, loan breakdown, or personalized budgeting plan!`;
}

// Vite middleware or production static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AetherFinance AI Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
