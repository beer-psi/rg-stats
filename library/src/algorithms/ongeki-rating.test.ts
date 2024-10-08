import t from "tap";
import { ThrowsToSnapshot } from "../test-utils/throw-snapshot";
import { calculate } from "./ongeki-rating";

t.test("O.N.G.E.K.I. Rating Tests", (t) => {
	// Test all the cutoffs for a random chart level
	// are where they should be.
	const LEVEL = 12.5;
	t.equal(calculate(1_010_000, LEVEL), LEVEL + 2);
	t.equal(calculate(1_007_500, LEVEL), LEVEL + 2);
	t.equal(calculate(1_000_000, LEVEL), LEVEL + 1.5);
	t.equal(calculate(990_000, LEVEL), LEVEL + 1);
	t.equal(calculate(970_000, LEVEL), LEVEL);
	t.equal(calculate(900_000, LEVEL), LEVEL - 4);
	t.equal(calculate(800_000, LEVEL), 2.78);
	t.equal(calculate(500_000, LEVEL), 0);
	t.equal(calculate(0, LEVEL), 0);

	// Also, lets just test some random values inbetween. This should
	// give us decent coverage of the formula.
	t.equal(calculate(987_000, LEVEL), 13.35);
	t.equal(calculate(1_003_000, LEVEL), 14.2);
	t.equal(calculate(999_000, LEVEL), 13.95);
	t.equal(calculate(994_000, LEVEL), 13.7);
	t.equal(calculate(980_000, LEVEL), 13);
	t.equal(calculate(950_000, LEVEL), 11.35);
	t.equal(calculate(810_000, LEVEL), 3.35);
	t.equal(calculate(600_000, LEVEL), 0);
	t.equal(calculate(50_000, LEVEL), 0);

	t.end();
});

t.test("O.N.G.E.K.I. Rating Edge Cases", (t) => {
	t.equal(
		calculate(1_010_000, 0),
		2,
		"A perfect score on a chart with level 0 should be valid, and worth 0 + 2."
	);
	t.equal(calculate(0, 12.5), 0, "A score of 0 should be worth 0.");
	t.equal(calculate(0, 0), 0, "A score of 0 on a chart with level 0 should be worth 0.");
	t.equal(calculate(1_007_880, 14.4), 16.4, "An SSS+ on a 14.4 should be worth 16.4.");

	t.end();
});

t.test("O.N.G.E.K.I. Rating Validation Tests", (t) => {
	ThrowsToSnapshot(t, () => calculate(-1, 12.5), "Should throw if your score is negative.");

	ThrowsToSnapshot(
		t,
		() => calculate(1_010_001, 12.5),
		"Should throw if your score is >= 1.01million."
	);

	ThrowsToSnapshot(t, () => calculate(900_000, -1), "Should throw if chart level is negative.");

	t.end();
});
