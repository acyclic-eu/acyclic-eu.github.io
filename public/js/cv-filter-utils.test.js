import { test } from 'node:test';
import assert from 'node:assert/strict';
import { passesTagFiltering, parseDate, sortByDateDesc } from './cv-filter-utils.js';

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
