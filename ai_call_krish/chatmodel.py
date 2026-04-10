from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI


SYSTEM_PROMPT = """
You are a strict trading psychology coach.

Rules:
- Identify the exact mistake in the trade
- Explain why the mistake happened (psychology)
- Give a clear, actionable fix (1-2 lines only)
- Do NOT give generic advice
- Be direct and slightly harsh

Also give scores (0-10):
- Discipline Score
- Risk Management Score
- Emotional Control Score

Example:

Input:
Emotion: fear
Mistake: early exit

Output:
1. Mistake: You exited the trade prematurely
2. Reason: Fear overpowered your trading plan and you lacked trust
3. Fix: Define stop-loss before entry and follow it strictly
4. Scores:
   - Discipline: 4
   - Risk Management: 6
   - Emotional Control: 3

---

Now analyze the given trade.

Return output in strict format only. No extra text.
"""


def prepare_input():
    return {
        "trade": {
            "entry_price": 100,
            "exit_price": 95,
            "position_size": 10,
            "setup": "breakout",
            "stop_loss": 90,
            "target": 120,
            "pnl": -5,
        },
        "behavior": {
            "emotion": "fear",
            "mistake": "early exit",
            "confidence": 4,
            "notes": "felt market will reverse",
        },
    }


def rule_engine(data):
    flags = []

    pnl = data["trade"]["pnl"]
    emotion = data["behavior"]["emotion"]

    if pnl < 0:
        flags.append("loss_trade")

    if emotion == "fear":
        flags.append("fear_detected")

    if data["trade"]["position_size"] > 20:
        flags.append("over_positioning")

    return flags


def build_model():
    load_dotenv()
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0)


def build_prompt(system_prompt, data, flags=None, past_context=None):
    sections = [
        system_prompt.strip(),
        "",
    ]

    if flags is not None:
        sections.extend(
            [
                "Detected Issues:",
                str(flags),
                "",
            ]
        )

    if past_context is not None:
        sections.extend(
            [
                "Previous Behavior:",
                str(past_context),
                "",
            ]
        )

    sections.extend(
        [
            "Current Trade:" if flags is not None or past_context is not None else "Trade Data:",
            str(data["trade"]),
            "",
            "Current Behavior:" if flags is not None or past_context is not None else "Behavior:",
            str(data["behavior"]),
        ]
    )

    return "\n".join(sections)


def create_temp_memory():
    return {
        "history": [],
    }


def load_past_context(memory_store):
    return memory_store["history"]


def save_context(memory_store, data, output):
    memory_store["history"].append(
        {
            "input": data,
            "output": output,
        }
    )


def main():
    model = build_model()
    memory_store = create_temp_memory()
    data = prepare_input()
    flags = rule_engine(data)
    past_context = load_past_context(memory_store)

    final_prompt = build_prompt(
        SYSTEM_PROMPT,
        data,
        flags=flags,
        past_context=past_context,
    )

    result = model.invoke(final_prompt)
    save_context(memory_store, data, result.content)

    print(result.content)


if __name__ == "__main__":
    main()
