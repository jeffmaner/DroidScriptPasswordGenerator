// GUI Support.

let selectedConfig = "";
let selectedSeparator = "";

function addConfigSaveAndLoadGUI(layoutMain, layoutConfig, fileUrls, buttons) {
  buttons.loadConfigButton.SetOnTouch(function () {
    let configDialog = app.CreateListDialog("Configuration",
      _.concat(_.sortBy(_.map(fileUrls, stripExtension)), ["Other"]));
    configDialog.SetOnTouch(function (conf) {
      if (conf === "Other")
        app.ChooseFile("Find Configuration File", "*/*", function (fileName) {
          loadConfig(fileName);
        });
      else
        loadConfig(`${appPath}/conf/${conf}.json`);
      selectedConfig = conf;
      updateDisplayedValues(buttons);
    });
    configDialog.Show();

  });
  layoutMain.AddChild(buttons.loadConfigButton);

  buttons.saveConfigButton.SetOnTouch(function () {
    app.SetClipboardText(JSON.stringify(config));
    app.ShowPopup("Configuration saved to clipboard.");
  });
  layoutMain.AddChild(buttons.saveConfigButton);
}

function addDictionaryAndWordSettingsGUI(layoutMain, layoutWords, fileUrls, buttons) {
  buttons.dictionaryButton.SetOnTouch(function () {
    let dictionaryDialog = app.CreateListDialog("Dictionary",  _.concat(_.map(fileUrls, stripExtension), ["Other"]));
    dictionaryDialog.SetOnTouch(function (dictionary) {
      if (dictionary === "Other")
        app.ChooseFile("Find Dictionary File", "*/*", function (fileName) {
          config.dictionaryFileUrl = fileName;
        });
      else
        config.dictionaryFileUrl = `${appPath}/dict/${dictionary}.txt`;
      updateDisplayedValues(buttons);
    });
    dictionaryDialog.Show();
  });

  layoutWords.AddChild(buttons.dictionaryButton);

  buttons.numberOfWordsButton.SetOnTouch(function () {
    let numberOfWordsDialog = app.CreateListDialog("Number of Words", _.range(2, 11));
    numberOfWordsDialog.SetOnTouch(function (wordCount) {
      config.numberOfWords = parseInt(wordCount);
      updateDisplayedValues(buttons);
    });
    numberOfWordsDialog.Show();
  });

  layoutWords.AddChild(buttons.numberOfWordsButton);

  buttons.minimumLengthOfWordsButton.SetOnTouch(function () {
    let wordLengthDialog = app.CreateListDialog("Minimum Lenth of Words", _.range(4, 13));

    wordLengthDialog.SetOnTouch(function (length) {
      config.minimumWordLength = parseInt(length);
      updateDisplayedValues(buttons);
    })

    wordLengthDialog.Show();
  });
  layoutWords.AddChild(buttons.minimumLengthOfWordsButton);

  buttons.maximumLengthOfWordsButton.SetOnTouch(function () {
    let wordLengthDialog = app.CreateListDialog("Maximum Lenth of Words", _.range(4, 13));

    wordLengthDialog.SetOnTouch(function (length) {
      config.maximumWordLength = parseInt(length);
      updateDisplayedValues(buttons);
    })

    wordLengthDialog.Show();
  });
  layoutWords.AddChild(buttons.maximumLengthOfWordsButton);

  addTransformationSettingsGUI(layoutWords, buttons);

  let closeSettingsButton = app.CreateButton("Return");
  closeSettingsButton.SetOnTouch(function () {
    layoutMain.SetVisibility("Show");
    layoutWords.SetVisibility("Hide");
    layoutMain.ChildToFront(layoutMain);
  });

  layoutWords.AddChild(closeSettingsButton);
}

function addTransformationSettingsGUI(layout, buttons) {
  buttons.transformationButton.SetOnTouch(function () {
    let transformationDialog = app.CreateListDialog(
      "Transformation", [ "lower case", "UPPER CASE", "alternating WORD case",
        "random word CAPITALIZATION", "iNVERSE tITLE cASE" ]);
    transformationDialog.SetOnTouch(function (selection) {
      config.transformation = selection;
      updateDisplayedValues(buttons);
    });

    transformationDialog.Show();
  });

  layout.AddChild(buttons.transformationButton);
}

function addSymbolsGUI(layoutMain, layoutSymbols, buttons) {
  addSeparatorSettingsGUI(layoutSymbols, buttons);

  buttons.paddingTypeButton.SetOnTouch(function () {
    let paddingTypeDialog = app.CreateListDialog("Padding Type", ["Fixed", "Adaptive"]);
    paddingTypeDialog.SetOnTouch(function (paddingType) {
      config.paddingType = paddingType;

      switch (paddingType) {
        case "Fixed":
          buttons.padToLengthButton.SetVisibility("Hide");
          buttons.appendedSymbolsCountButton.SetVisibility("Show");
          break;
        case "Adaptive":
          buttons.appendedSymbolsCountButton.SetVisibility("Hide");
          buttons.padToLengthButton.SetVisibility("Show");
          break;
        default:
          // Fail silently for now.
          break;
      }

      updateDisplayedValues(buttons);
    });

    paddingTypeDialog.Show();
  });
  layoutSymbols.AddChild(buttons.paddingTypeButton);

  buttons.prependedSymbolsCountButton.SetOnTouch(function () {
    let countDialog = app.CreateListDialog("Prepended Symbol Count", _.range(0, 11));

    countDialog.SetOnTouch(function (count) {
      config.prependedSymbolsCount = parseInt(count);
      updateDisplayedValues(buttons);
    });

    countDialog.Show();
  });
  layoutSymbols.AddChild(buttons.prependedSymbolsCountButton);

  buttons.appendedSymbolsCountButton.SetOnTouch(function () {
    let countDialog = app.CreateListDialog("Appended Symbol Count", _.range(0, 11));

    countDialog.SetOnTouch(function (count) {
      config.appendedSymbolsCount = parseInt(count);
      updateDisplayedValues(buttons);
    });

    countDialog.Show();
  });
  if (config.paddingType !== "Fixed")
    buttons.appendedSymbolsCountButton.SetVisibility("Hide");
  layoutSymbols.AddChild(buttons.appendedSymbolsCountButton);

  buttons.padToLengthButton.SetOnTouch(function () {
    let countDialog = app.CreateListDialog("Appended Symbol Count", _.range(0, 100));
    countDialog.SetOnTouch(function (count) {
      config.padToLength = parseInt(count);
      updateDisplayedValues(buttons);
    });

    countDialog.Show();
  });
  if (config.paddingType !== "Adaptive")
    buttons.padToLengthButton.SetVisibility("Hide");
  layoutSymbols.AddChild(buttons.padToLengthButton);

  buttons.symbolsButton.SetOnTouch(function () {
    let symbolsDialog = app.CreateListDialog("Symbol",
      ["none", "Specified Character", "Random Character", "Separator Character"]);
    symbolsDialog.SetOnTouch(function (selection) {
      switch (selection) {
        case "none":
          config.paddingSymbol = "";
          break;
        case "Specified Character":
          let symbol = prompt("Padding Symbol", config.paddingSymbol);
          config.paddingSymbol = symbol;
          break;
        case "Random Character":
          let symbols = config.paddingSymbols.join("");
          let response = prompt("Chosen From", symbols);
          config.paddingSymbol = pick(1, response.split(""));
          break;
        case "Separator Character":
          config.useSeparatorChar = true;
          break;
        default:
          config.paddingSymbol = "/";
          break;
      };
      updateDisplayedValues(buttons);
    });

    symbolsDialog.Show();
  });

  layoutSymbols.AddChild(buttons.symbolsButton);

  let closeSettingsButton = app.CreateButton("Return");
  closeSettingsButton.SetOnTouch(function () {
    layoutMain.SetVisibility("Show");
    layoutSymbols.SetVisibility("Hide");
    layoutMain.ChildToFront(layoutMain);
  });

  layoutSymbols.AddChild(closeSettingsButton);
}

function addPaddingDigitsSettingsGUI(layoutMain, layoutPaddingDigits, buttons) {
  buttons.prependedDigitsCountButton.SetOnTouch(function () {
    let countDialog = app.CreateListDialog("Digits Count", _.range(0, 11));

    countDialog.SetOnTouch(function (count) {
      config.prependedDigitsCount = parseInt(count);
      updateDisplayedValues(buttons);
    });

    countDialog.Show();
    updateDisplayedValues(buttons);
  });
  layoutPaddingDigits.AddChild(buttons.prependedDigitsCountButton);

  buttons.appendedDigitsCountButton.SetOnTouch(function () {
    let countDialog = app.CreateListDialog("Digits Count", _.range(0, 11));

    countDialog.SetOnTouch(function (count) {
      config.appendedDigitsCount = parseInt(count);
      updateDisplayedValues(buttons);
    });

    countDialog.Show();
    updateDisplayedValues(buttons);
  });
  layoutPaddingDigits.AddChild(buttons.appendedDigitsCountButton);

  let closeSettingsButton = app.CreateButton("Return");
  closeSettingsButton.SetOnTouch(function () {
    layoutMain.SetVisibility("Show");
    layoutPaddingDigits.SetVisibility("Hide");
    layoutMain.ChildToFront(layoutMain);
  });
  layoutPaddingDigits.AddChild(closeSettingsButton);
}

function addSeparatorSettingsGUI(layout, buttons) {
  let selectedSeparator = "";
  buttons.separatorsButton.SetOnTouch(function () {
    let separatorsDialog = app.CreateListDialog("Separator",
      ["none", "Specified Character", "Random Character"]);
    separatorsDialog.SetOnTouch(function (selection) {
      selectedSeparator = selection;

      switch (selection) {
        case "none":
          config.separators = [];
          break;
        case "Specified Character":
          let separator = prompt("Separator", "-");
          config.separators = [separator];
          break;
        case "Random Character":
          let symbols = config.separators.join("");
          let response = prompt("Chosen From", symbols);
          config.separators = response.split("");
          break;
        default:
          config.separators = defaultSymbols;
          break;
      };
      updateDisplayedValues(buttons);
    });

    separatorsDialog.Show();
  });

  layout.AddChild(buttons.separatorsButton);
}

function addNumberOfPasswordsGUI(layout, buttons) {
  buttons.numberOfPasswordsButton.SetOnTouch(function () {
    let numberOfPasswordsDialog = app.CreateListDialog("Number of Passwords", _.range(1, 11));
    numberOfPasswordsDialog.SetOnTouch(function (n) {
      config.passwordsToGenerate = parseInt(n);
      updateDisplayedValues(buttons);
    });

    numberOfPasswordsDialog.Show();
  });

  layout.AddChild(buttons.numberOfPasswordsButton);
}

function createDrawer(drawerWidth, layoutMain, layoutWords, layoutSymbols, layoutPaddingDigits) {
  let drawer = app.CreateScroller(drawerWidth, 1);
  drawer.SetBackColor("White");

  let layerDrawer = app.CreateLayout("Linear", "Left");
  drawer.AddChild(layerDrawer);

  let layoutMenu = app.CreateLayout("Linear", "Left");
  layerDrawer.AddChild(layoutMenu);

  let listItems = "Main, Words, Symbols, Padding Digits";
  let listMenu = app.CreateList(listItems, drawerWidth, -1, "Menu, Expand");
  listMenu.SetColumnWidths(-1, 0.35, 0.18);
  listMenu.SetOnTouch(function (title, body, type, index) {
    this.SelectItemByIndex(index, true);
    app.CloseDrawer("Left");

    this.SelectItemByIndex(index, true);

    switch (title) {
      case "Main":
        layoutMain.SetVisibility("Show");
        layoutWords.SetVisibility("Hide");
        layoutSymbols.SetVisibility("Hide");
        layoutPaddingDigits.SetVisibility("Hide");
        layoutMain.ChildToFront(layoutMain);
        break;
      case "Words":
        layoutWords.SetVisibility("Show");
        layoutSymbols.SetVisibility("Hide");
        layoutPaddingDigits.SetVisibility("Hide");
        layoutMain.SetVisibility("Hide");
        layoutMain.ChildToFront(layoutWords);
        break;
      case "Symbols":
        layoutSymbols.SetVisibility("Show");
        layoutWords.SetVisibility("Hide");
        layoutPaddingDigits.SetVisibility("Hide");
        layoutMain.SetVisibility("Hide");
        layoutMain.ChildToFront(layoutSymbols);
        break;
      case "Padding Digits":
        layoutPaddingDigits.SetVisibility("Show");
        layoutWords.SetVisibility("Hide");
        layoutSymbols.SetVisibility("Hide");
        layoutMain.SetVisibility("Hide");
        layoutMain.ChildToFront(layoutPaddingDigits);
        break;
    }
  });
  layoutMenu.AddChild(listMenu);

  return drawer;
}

function updateDisplayedValues(buttons) {
  buttons.loadConfigButton.SetText("Load Config" +
    (selectedConfig.length > 0
      ? ` [${selectedConfig}]`
      : "")),
  buttons.saveConfigButton.SetText("Save Config" +
    (selectedConfig.length > 0
      ? ` [${selectedConfig}]`
      : "")),
  buttons.dictionaryButton.SetText(`Dictionary [${stripPath(stripExtension(config.dictionaryFileUrl))}]`),
  buttons.numberOfWordsButton.SetText(`Number of Words [${config.numberOfWords}]`),
  buttons.minimumLengthOfWordsButton.SetText(`Minimum Length [${config.minimumWordLength}]`),
  buttons.maximumLengthOfWordsButton.SetText(`Maximum Length [${config.maximumWordLength}]`),
  buttons.transformationButton.SetText(`Transformation [${config.transformation}]`),
  buttons.paddingTypeButton.SetText(`Padding Type [${config.paddingType}]`),
  buttons.padToLengthButton.SetText(`Pad to Length [${config.padToLength}]`),
  buttons.prependedSymbolsCountButton.SetText(`Prepended Symbols [${config.prependedSymbolsCount}]`),
  buttons.appendedSymbolsCountButton.SetText(`Appended Symbols [${config.appendedSymbolsCount}]`),
  buttons.symbolsButton.SetText(`Symbol [${config.paddingSymbol}]`),
  buttons.prependedDigitsCountButton.SetText(`Prepended Digits [${config.prependedDigitsCount}]`),
  buttons.appendedDigitsCountButton.SetText(`Appended Digits [${config.appendedDigitsCount}]`),
  buttons.separatorsButton.SetText("Separator" +
    (selectedSeparator.length > 0
      ? ` [${selectedSeparator}]`
      : "")),
  buttons.numberOfPasswordsButton.SetText(`Number of Passwords [${config.passwordsToGenerate}]`)

  switch (config.paddingType) {
    case "Fixed":
      buttons.padToLengthButton.SetVisibility("Hide");
      buttons.appendedSymbolsCountButton.SetVisibility("Show");
      break;
    case "Adaptive":
      buttons.appendedSymbolsCountButton.SetVisibility("Hide");
      buttons.padToLengthButton.SetVisibility("Show");
      break;
    default:
      // Fail silently for now.
      break;
  }
}
