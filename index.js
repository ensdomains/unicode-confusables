const emojiRegex = require('emoji-regex');
const CONFUSABLES = require('./data/confusables.json');

const ZERO_WIDTH = '';
const zeroWidthPoints = new Set([
  '\u200b', // zero width space
  '\u200c', // zero width non-joiner
  '\u200d', // zero width joiner
  '\ufeff', // zero width no-break space
  '\u2028', // line separator
  '\u2029', // paragraph separator,
]);

function makeSkeleton(segments) {
  return segments.reduce((acc, point) => {
    if (!emojiRegex().test(point)) {
      let newPoint = point;
      for (var i = 0, l = point.length; i < l; i++) {
        if (zeroWidthPoints.has(point[i])) {
          newPoint = point.slice(0, i) + point.slice(i + 1);
        }
      }
      point = newPoint;
    }
    acc.push(CONFUSABLES[point] || point);
    return acc;
  }, []);
}

function isConfusing(string) {
  const segments = [...new Intl.Segmenter().segment(string)].map(
    ({ segment }) => segment
  );
  const skeleton = makeSkeleton(segments);
  const original = segments;
  for (var i = 0, l = skeleton.length; i < l; i++) {
    if (skeleton[i] !== original[i]) return true;
  }

  return false;
}

function confusables(string) {
  const segments = [...new Intl.Segmenter().segment(string)].map(
    ({ segment }) => segment
  );
  const skeleton = makeSkeleton(segments);
  const original = segments;
  let offset = 0;

  return original.reduce((acc, point, index) => {
    const target = skeleton[index - offset];
    if (target === point || !target) {
      acc.push({ point: point });
    } else if (zeroWidthPoints.has(point)) {
      acc.push({ point, similarTo: ZERO_WIDTH });
      offset = offset + 1;
    } else {
      acc.push({ point, similarTo: target });
    }

    return acc;
  }, []);
}

function rectifyConfusion(string) {
  return confusables(string)
    .map(({ point, similarTo }) => (similarTo == null ? point : similarTo))
    .join('');
}

module.exports = {
  isConfusing,
  confusables,
  rectifyConfusion,
};
