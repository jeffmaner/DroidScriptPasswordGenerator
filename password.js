// Password Generation.

let satisfactoryWordsCount = 0;

function generatePasswords(config, wordDictionary) {
  function fits(word) {
    let n = word.length;

    return config.minimumWordLength <= n && n <= config.maximumWordLength;
  }

  let satisfactoryWords = wordDictionary.filter(fits);

  satisfactoryWordsCount = satisfactoryWords.length;

  function pickWords() {
    return pick(config.numberOfWords, satisfactoryWords);
  }

  function transformWords(ws) {
    function isEven(n) {
      return n % 2 === 0;
    }

    function isOdd(n) {
      return !isEven(n);
    }

    let ns = _.range(ws.length);

    switch (config.transformation) {
      case "lower case":
        return _.map(ws, _.lowerCase);
      case "UPPER CASE":
        return _.map(ws, _.upperCase);
      case "random word CAPITALIZATION":
        return _.map(ns, function (w) {
          let ms = _.range(99);
          return isEven(pick(1, ms))
            ? ws[w].toUpperCase()
            : ws[w];
        })
      case "iNVERSE tITLE cASE":
        return _.map(ws, function (w) {
          return _.lowerFirst(_.upperCase(w));
        });
      default:
        return _.map(ns, function (w) {
          return isOdd(w)
            ? ws[w].toUpperCase()
            : ws[w];
        });
    };
  }

  function pickSeparator() {
    return pick(1, config.separators);
  }

  function pickDigits(count) {
    let ns = _.range(count);

    return _.map(ns, function () {
      return randomBetween(0, 9);
    });
  }

  function getPaddingSymbol(separatorChar) {
    switch (config) {
      case "none":
        config.paddingSymbol = "";
        break;
      case "Specified Symbol":
        let symbol = prompt("Padding Symbol", "/");
        config.paddingSymbol = symbol;
        break;
      case "Separator Character":
        config.useSeparatorChar = true;
        break;
      case "Random Character":
        // Already set in GUI.
        break;
      default:
        config.paddingSymbol = "/";
        break;
    };
  }

  function generatePassword() {
    let separator = pickSeparator();

    let paddingSymbol = config.useSeparatorChar
      ? separator
      : config.paddingSymbol;

    let forePaddingSymbols = paddingSymbol.repeat(config.prependedSymbolsCount);
    let aftPaddingSymbols = paddingSymbol.repeat(config.appendedSymbolsCount);

    let forePaddingDigits = pickDigits(config.prependedDigitsCount).join("");
    if (forePaddingDigits.length > 0)
      forePaddingDigits = `${forePaddingDigits}${separator}`;

    let aftPaddingDigits = pickDigits(config.appendedDigitsCount).join("");
    if (aftPaddingDigits.length > 0)
      aftPaddingDigits = `${separator}${aftPaddingDigits}`;

    let words = pickWords();
    let transformedWords = transformWords(words);
    let joinedWords = transformedWords.join(separator);

    let password = [
      forePaddingSymbols,
      forePaddingDigits,
      joinedWords,
      aftPaddingDigits,
      aftPaddingSymbols ].join("");

    password = password.length < config.padToLength
      ? password + aftPaddingSymbols.repeat(config.padToLength - password.length)
      : password;

    return password;
  }

  let ns = _.range(config.passwordsToGenerate);

  return _.map(ns, function () {
    return generatePassword();
  });
}
