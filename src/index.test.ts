import { trashcal } from "./";

test('alltypes', async () => {
    const result = await trashcal({ id: 'alltypes' });
    expect(result.length()).toBe(3)
})

test('noteligible', async () => {
    const result = await trashcal({ id: 'noteligible' });
    expect(result.length()).toBe(2)
})