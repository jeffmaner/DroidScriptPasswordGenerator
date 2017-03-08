// Entropy Calculation Support.
function permutationCount(possibleStates, repetitions) {
  return Math.pow(possibleStates, repetitions);
}

function entropySeen(config) {
  let caseMultiplier = (
    config.transformation === "lower case" ||
    config.transformation === "UPPER CASE")
      ? 1
      : 2;

  let wordsPermutations =
      permutationCount(caseMultiplier * satisfactoryWordsCount, config.numberOfWords);
  let separatorPermutations = config.separators.length > 0
    ? permutationCount(config.separators.length, 1)
    : 1;
  let paddingDigitsPermutations =
      permutationCount(10, config.prependedDigitsCount + config.appendedDigitsCount);
  let paddingSymbolsPermutations =
      config.prependedSymbolsCount + config.appendedSymbolsCount > 0
      ? permutationCount(defaultSymbols.length, 1)
      : 1;

  let permutations = wordsPermutations
    * separatorPermutations
    * paddingDigitsPermutations
    * paddingSymbolsPermutations;

  return log2(permutations);
}

function entropyBlind(config) {
  let alphabetSize = calculateAlphabetSize(config);
  let minimumPasswordLength = calculateMinimumPasswordLength(config);

  return log2(permutationCount(alphabetSize, minimumPasswordLength));
}

function calculateAlphabetSize(config) {
  let size = (
    config.transformation === "lower case" ||
    config.transformation === "UPPER CASE")
      ? 26
      : 52;

  let symbol = config.separators.length > 0
    || config.prependedSymbolsCount + config.appendedSymbolsCount > 0;

  if (symbol)
    size += 33;

  if (config.prependedDigitsCount + config.appendedDigitsCount > 0)
    size += 10;

  return size;
}

function calculateMinimumPasswordLength(config) {
  if (config.paddingType === "Adaptive")
    return config.padToLength;
  else {
    let size = config.numberOfWords * config.minimumWordLength;

    if (config.separators.length > 0)
      size += (config.numberOfWords
        - 1
        + config.prependedDigitsCount
        + config.appendedDigitsCount);

    size += config.prependedSymbolsCount + config.appendedSymbolsCount;

    return size;
  }
}

function log2(n) {
  return Math.log(n) / Math.LN2;
}
