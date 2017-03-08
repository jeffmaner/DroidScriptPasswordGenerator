app.LoadPlugin("Lodash");

app.LoadScript("entropy.js");
app.LoadScript("random.js");
app.LoadScript("text.js");
app.LoadScript("password.js");
app.LoadScript("configuration.js");
app.LoadScript("gui.js");

let appPath = app.GetAppPath();

function OnStart() {
  app.SetOrientation("Portrait");

  let dictUrls = app.ListFolder(appPath + "/dict", ".txt").toString().split(",");
  let confUrls = app.ListFolder(appPath + "/conf", ".json").toString().split(",");

  let buttons = {
    loadConfigButton: app.CreateButton("Load Config" +
      (selectedConfig.length > 0
        ? ` [${selectedConfig}]`
        : "")),
    saveConfigButton: app.CreateButton("Save Config" +
      (selectedConfig.length > 0
        ? ` [${selectedConfig}]`
        : "")),
    dictionaryButton: app.CreateButton(`Dictionary [${stripPath(stripExtension(config.dictionaryFileUrl))}]`),
    numberOfWordsButton: app.CreateButton(`Number of Words [${config.numberOfWords}]`),
    minimumLengthOfWordsButton: app.CreateButton(`Minimum Length [${config.minimumWordLength}]`),
    maximumLengthOfWordsButton: app.CreateButton(`Maximum Length [${config.maximumWordLength}]`),
    transformationButton: app.CreateButton(`Transformation [${config.transformation}]`),
    paddingTypeButton: app.CreateButton(`Padding Type [${config.paddingType}]`),
    padToLengthButton: app.CreateButton(`Pad to Length [${config.padToLength}]`),
    prependedSymbolsCountButton: app.CreateButton(`Prepended Symbols [${config.prependedSymbolsCount}]`),
    appendedSymbolsCountButton: app.CreateButton(`Appended Symbols [${config.appendedSymbolsCount}]`),
    symbolsButton: app.CreateButton(`Symbol [${config.paddingSymbol}]`),
    prependedDigitsCountButton: app.CreateButton(`Prepended Digits [${config.prependedDigitsCount}]`),
    appendedDigitsCountButton: app.CreateButton(`Appended Digits [${config.appendedDigitsCount}]`),
    separatorsButton: app.CreateButton("Separator" +
      (selectedSeparator.length > 0
        ? ` [${selectedSeparator}]`
        : "")),
    numberOfPasswordsButton: app.CreateButton(`Number of Passwords [${config.passwordsToGenerate}]`)
  }

  let layoutMain = app.CreateLayout("linear", "VCenter, FillXY");

  let scroller = app.CreateScroller();
  let layoutScroller = app.CreateLayout("linear", "VCenter, FillXY");

  let layoutConfig = app.CreateLayout("linear", "VCenter,FillXY");
  layoutConfig.SetVisibility("Hide");
  layoutConfig.SetBackColor("#ff000000");

  addConfigSaveAndLoadGUI(layoutScroller, layoutConfig, confUrls, buttons);

  app.AddLayout(layoutConfig);

  // Dictionary and Word List.
  let layoutWords = app.CreateLayout("linear", "VCenter,FillXY");
  layoutWords.SetVisibility("Hide");
  layoutWords.SetBackColor("#ff000000");

  addDictionaryAndWordSettingsGUI(layoutMain, layoutWords, dictUrls, buttons);

  app.AddLayout(layoutWords);

  // Symbols.
  let layoutSymbols = app.CreateLayout("linear", "VCenter,FillXY");
  layoutSymbols.SetVisibility("Hide");
  layoutSymbols.SetBackColor("#ff000000");

  addSymbolsGUI(layoutMain, layoutSymbols, buttons);

  app.AddLayout(layoutSymbols);

  // Padding Digits.
  let layoutPaddingDigits = app.CreateLayout("linear", "VCenter,FillXY");
  layoutPaddingDigits.SetVisibility("Hide");
  layoutPaddingDigits.SetBackColor("#ff000000");

  addPaddingDigitsSettingsGUI(layoutMain, layoutPaddingDigits, buttons);

  app.AddLayout(layoutPaddingDigits);

  addNumberOfPasswordsGUI(layoutScroller, buttons);

  let drawerWidth = 0.75;
  let drawer = createDrawer(drawerWidth, layoutMain, layoutWords, layoutSymbols, layoutPaddingDigits);
  app.AddDrawer(drawer, "Left", drawerWidth);

  // Password listing.
  let passwordListing = app.CreateTextEdit("");
  passwordListing.SetTextSize(18);
  layoutScroller.AddChild(passwordListing);

  // Entropy statistics.
  let beLowerLimit = 78;
  let seLowerLimit = 52;

  let blindRecommendation = app.CreateText(`Recommend keeping blind entropy above ${beLowerLimit} bits.`);
  layoutScroller.AddChild(blindRecommendation);
  let blindEntropy = app.CreateText("", "Html");
  layoutScroller.AddChild(blindEntropy);

  let seenRecommendation = app.CreateText(`Recommend keeping seen entropy above ${seLowerLimit} bits.`);
  layoutScroller.AddChild(seenRecommendation);
  let seenEntropy = app.CreateText("", null, null, "Html");
  layoutScroller.AddChild(seenEntropy);

  // Generation button.
  let generateButton = app.CreateButton("Generate");
  generateButton.SetOnTouch(function () {
    if (!app.FileExists(config.dictionaryFileUrl)) {
      alert(`Dictionary file ${config.dictionaryFileUrl} not found.`);
      return;
    }

    let wordFileContents = app.ReadFile(config.dictionaryFileUrl);
    let wordDictionary = withoutComments(toLines(wordFileContents));
    let passwords = generatePasswords(config, wordDictionary);
    passwordListing.SetText(fromLines(passwords));

    let be = Math.round(entropyBlind(config));
    let se = Math.round(entropySeen(config));

    let red = "#ff0000";
    let green = "#00ff00";

    let beColor = be > beLowerLimit ? green : red;
    let seColor = se > seLowerLimit ? green : red;

    blindEntropy.SetHtml(`Blind Entropy: ~<font color="${beColor}">${be}</font> bits`);
    seenEntropy.SetHtml(`Seen Entropy: ~<font color="${seColor}">${se}</font> bits`);
  });
  layoutScroller.AddChild(generateButton);

  scroller.AddChild(layoutScroller);
  app.AddLayout(layoutScroller);
  layoutMain.AddChild(scroller);
  layoutMain.ChildToFront(scroller);
  app.AddLayout(layoutMain);
}
