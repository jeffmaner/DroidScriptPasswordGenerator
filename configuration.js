// Configuration.
let defaultSymbols = [ "!", "@", "$", "%", "^", "&", "*", "-", "_", "+", "=", ":", "|", "~", ",", "?", ".", ";", "/" ];
let defaultTransformation = "alternating WORD case";

let config = {
  minimumWordLength: 4,
  maximumWordLength: 8,
  numberOfWords: 3,
  transformation: defaultTransformation,
  passwordsToGenerate: 10,
  separators: defaultSymbols,
  prependedDigitsCount: 2,
  appendedDigitsCount: 2,
  paddingType: "Fixed",
  padToLength: 0,
  prependedSymbolsCount: 3,
  appendedSymbolsCount: 5,
  useSeparatorChar: false,
  paddingSymbols: defaultSymbols,
  paddingSymbol: "/",
  dictionaryFileUrl: "EN_sample.txt"
};

function loadConfig(fileName) {
  config = JSON.parse(app.ReadFile(fileName));
  config.dictionaryFileUrl = `${appPath}/dict/${config.dictionaryFileUrl}`;
}

