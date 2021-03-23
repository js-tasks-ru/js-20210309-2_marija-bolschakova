/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
 export function sortStrings(arr, param = 'asc') {
    switch (param) {
    case 'asc':
      return sortArray(arr, 1);
    case 'desc':
      return sortArray(arr, -1);
    default:
      return arr;
    }
  }
  
  function sortArray(arr, reverse) {
    return [...arr].sort((a, b) => reverse * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'}));
  }

