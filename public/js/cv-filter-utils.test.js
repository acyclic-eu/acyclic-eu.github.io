import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passesTagFiltering, parseDate, sortByDateDesc, passesTimeFilter, applyTagsAndSort } from './cv-filter-utils.js';

const MAX_DATE = new Date(8640000000000000);

test('passesTagFiltering', async (t) => {
  await t.test('passes when experience has no tags', () => {
    assert.equal(passesTagFiltering('', ['Developer']), true);
    assert.equal(passesTagFiltering(null, ['Developer']), true);
  });

  await t.test('passes when experience has no tags and no tags selected', () => {
    assert.equal(passesTagFiltering('', []), true);
  });

  await t.test('fails when experience has tags but none are selected', () => {
    assert.equal(passesTagFiltering(encodeURIComponent('Developer'), []), false);
  });

  await t.test('passes when at least one tag matches', () => {
    assert.equal(passesTagFiltering(encodeURIComponent('Developer,Leader'), ['Developer']), true);
  });

  await t.test('fails when no tags match', () => {
    assert.equal(passesTagFiltering(encodeURIComponent('Coach'), ['Developer']), false);
  });

  await t.test('trims whitespace from tags', () => {
    assert.equal(passesTagFiltering(encodeURIComponent(' Developer '), ['Developer']), true);
  });
});

test('parseDate', async (t) => {
  await t.test('returns max date for null', () => {
    assert.equal(parseDate(null, new Date(0)).getTime(), MAX_DATE.getTime());
  });

  await t.test('returns max date for empty string', () => {
    assert.equal(parseDate('', new Date(0)).getTime(), MAX_DATE.getTime());
  });

  await t.test('returns max date for "Present"', () => {
    assert.equal(parseDate('Present', new Date(0)).getTime(), MAX_DATE.getTime());
  });

  await t.test('parses a valid date string', () => {
    assert.equal(parseDate('2020-06-15', new Date(0)).getFullYear(), 2020);
  });

  await t.test('returns fallback for an invalid date string', () => {
    const fallback = new Date(0);
    assert.equal(parseDate('not-a-date', fallback), fallback);
  });
});

test('passesTimeFilter', async (t) => {
  const TODAY = new Date('2024-06-01');

  await t.test('yearDepth=0 passes current role (Present)', () => {
    assert.equal(passesTimeFilter({ end_date: 'Present' }, 0, TODAY), true);
  });

  await t.test('yearDepth=0 passes role with no end_date', () => {
    assert.equal(passesTimeFilter({ end_date: null }, 0, TODAY), true);
  });

  await t.test('yearDepth=0 fails past role', () => {
    assert.equal(passesTimeFilter({ end_date: '2020-01-01' }, 0, TODAY), false);
  });

  await t.test('yearDepth=5 passes current role', () => {
    assert.equal(passesTimeFilter({ end_date: 'Present' }, 5, TODAY), true);
  });

  await t.test('yearDepth=5 passes role ending within window', () => {
    assert.equal(passesTimeFilter({ end_date: '2021-06-01' }, 5, TODAY), true);
  });

  await t.test('yearDepth=5 fails role ending before window', () => {
    assert.equal(passesTimeFilter({ end_date: '2018-01-01' }, 5, TODAY), false);
  });
});

test('applyTagsAndSort', async (t) => {
  const exp = (title, end_date, tags, descriptions = []) => ({
    title, end_date, tags: encodeURIComponent(tags.join(',')), descriptions
  });

  await t.test('filters out experiences whose tags do not match', () => {
    const exps = [exp('A', '2023-01-01', ['Dev']), exp('B', '2022-01-01', ['PM'])];
    const result = applyTagsAndSort(exps, ['Dev']);
    assert.equal(result.length, 1);
    assert.equal(result[0].title, 'A');
  });

  await t.test('sorts results by date descending', () => {
    const exps = [exp('Old', '2020-01-01', ['Dev']), exp('New', '2023-01-01', ['Dev'])];
    const result = applyTagsAndSort(exps, ['Dev']);
    assert.equal(result[0].title, 'New');
    assert.equal(result[1].title, 'Old');
  });

  await t.test('filters descriptions by selected tags', () => {
    const descriptions = [
      { text: 'Led team', tags: encodeURIComponent('Leader') },
      { text: 'Wrote code', tags: encodeURIComponent('Dev') }
    ];
    const exps = [exp('A', '2023-01-01', ['Dev'], descriptions)];
    const result = applyTagsAndSort(exps, ['Dev']);
    assert.equal(result[0].descriptions.length, 1);
    assert.equal(result[0].descriptions[0].text, 'Wrote code');
  });

  await t.test('passes all experiences when they have no tags', () => {
    const exps = [exp('A', '2023-01-01', []), exp('B', '2022-01-01', [])];
    const result = applyTagsAndSort(exps, ['Dev']);
    assert.equal(result.length, 2);
  });
});

test('sortByDateDesc', async (t) => {
  await t.test('sorts current role before past role', () => {
    const current = { end_date: 'Present', start_date: '2022-01-01' };
    const past    = { end_date: '2021-12-31', start_date: '2019-01-01' };
    assert.ok(sortByDateDesc(current, past) < 0, 'current should come first');
    assert.ok(sortByDateDesc(past, current) > 0, 'past should come second');
  });

  await t.test('sorts by most recent end date first', () => {
    const newer = { end_date: '2023-01-01', start_date: '2021-01-01' };
    const older = { end_date: '2020-01-01', start_date: '2018-01-01' };
    assert.ok(sortByDateDesc(newer, older) < 0, 'newer end date should come first');
  });

  await t.test('sorts by start date when end dates are equal', () => {
    const laterStart  = { end_date: '2022-12-31', start_date: '2021-01-01' };
    const earlierStart = { end_date: '2022-12-31', start_date: '2018-01-01' };
    assert.ok(sortByDateDesc(laterStart, earlierStart) < 0, 'later start should come first');
  });

  await t.test('returns 0 for identical dates', () => {
    const a = { end_date: '2022-12-31', start_date: '2020-01-01' };
    const b = { end_date: '2022-12-31', start_date: '2020-01-01' };
    assert.equal(sortByDateDesc(a, b), 0);
  });
});
