const { selection } = require("scenegraph");
const { editDocument,appLanguage } = require("application");
const strings = require("./strings.json");
const supportedLanguages = require("./manifest.json").languages;
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];

let panel;

const create = () => {
  const html = `
  <style>
  hr {
    margin: 10px 0 20px;
  }
  h2 {
    font-size: 14px;
    color: #666666;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    font-size: 0.8rem;
    list-style: none;
    border-radius: 2px;
    line-height: 1;
  }
  li:hover {
    background: #e5ecef;
  }
  label {
    display: flex;
    align-items: center;
    padding: 10px 0;
    padding-left: 4px;
    color: #666666;
  }
  .ratio {
    font-size: 14px;
    width: 5em;
  }
  .ratio-name {
    font-size: 14px;
  }
  input[type="radio"] {
    margin: 0 8px 0 4px;
  }
  .custom-ratio {
    margin-top: 20px;
  }
  .custom-input {
    display: flex;
    align-item: center;
  }
  .colon {
    text-align: center;
    align-self: center;
  }
  input[type="number"] {
    width: 6em;
    padding: 4px;
    padding-left: 10px;
  }
  .trans-button {
    display: block;
    margin: 20px auto;
  }
  .is-warning form,
  .warning-text {
    display: none;
  }
  .is-warning .warning-text {
    display: block;
  }
</style>
<div class="wrapper">
<p class="warning-text">Please select one or more objects for which you want to change the aspect ratio.</p>
<form method="panel">
<div class="container">
  <div class="basis-list" id="basis-list">
    <h2 id="basis-header">${strings[uiLang].basisHeader}</h2>
    <ul>
      <li>
        <label for="basis-width">
          <input
            type="radio"
            name="basis"
            id="basis-width"
            value="basis-width"
            checked="checked"
          />
          width
        </label>
      </li>
      <li>
        <label for="basis-height">
          <input
            type="radio"
            name="basis"
            id="basis-height"
            value="basis-height"
          />
          height
        </label>
      </li>
    </ul>
  </div>

  <hr />

  <div class="basis-list" id="basis-list">
    <h2 id="orientation-header">${strings[uiLang].orientation}</h2>
    <ul>
      <li>
        <label for="landscape">
          <input
            type="radio"
            name="selectOrientation"
            id="landscape"
            value="landscape"
            checked="checked"
          />
          ${strings[uiLang].landscape}
        </label>
      </li>
      <li>
        <label for="portrait">
          <input
            type="radio"
            name="selectOrientation"
            id="portrait"
            value="portrait"
          />
          ${strings[uiLang].portrait}
        </label>
      </li>
    </ul>
  </div>

  <hr />

  <div class="ratio-list" id="ratio-list">
    <h2 id="ratio-header">${strings[uiLang].ratioHeader}</h2>
    <ul>
      <li>
        <label for="square">
          <input type="radio" name="ratio" id="square" value="square" />
          <div class="ratio">1:1</div>
          <div class="ratio-name" id="square-text">${strings[uiLang].squareText}</div>
        </label>
      </li>
      <li>
        <label for="golden">
          <input
            type="radio"
            name="ratio"
            id="golden"
            value="golden"
            checked="checked"
          />
          <div class="ratio">1.618:1</div>
          <div class="ratio-name" id="golden-text">${strings[uiLang].goldenText}</div>
        </label>
      </li>
      <li>
        <label for="yamato">
          <input type="radio" name="ratio" id="yamato" value="yamato" />
          <div class="ratio">1.414:1</div>
          <div class="ratio-name" id="yamato-text">${strings[uiLang].yamatoText}</div>
        </label>
      </li>
      <li>
        <label for="retro">
          <input type="radio" name="ratio" id="retro" value="retro" />
          <div class="ratio">4:3</div>
          <div class="ratio-name" id="retro-text">${strings[uiLang].retroText}</div>
        </label>
      </li>
      <li>
        <label for="camera">
          <input type="radio" name="ratio" id="camera" value="camera" />
          <div class="ratio">3:2</div>
          <div class="ratio-name" id="camera-text">${strings[uiLang].cameraText}</div>
        </label>
      </li>
      <li>
        <label for="monitor">
          <input type="radio" name="ratio" id="monitor" value="monitor" />
          <div class="ratio">16:9</div>
          <div class="ratio-name" id="monitor-text">${strings[uiLang].monitorText}</div>
        </label>
      </li>
      <li>
        <label for="wide">
          <input type="radio" name="ratio" id="wide" value="wide" />
          <div class="ratio">16:10</div>
          <div class="ratio-name" id="wide-text">${strings[uiLang].wideText}</div>
        </label>
      </li>
      <li>
        <label for="triangle">
          <input type="radio" name="ratio" id="triangle" value="triangle" />
          <div class="ratio">2:√3</div>
          <div class="ratio-name" id="triangle-text">${strings[uiLang].triangleText}</div>
        </label>
      </li>
    </ul>
  </div>
  <div class="custom-ratio">
    <h2 id="custom-header">${strings[uiLang].customHeader}</h2>
    <div class="custom-input">
      <input type="number" name="custom-left" id="custom-left" placeholder="0" min="1" max="9999" />
      <div class="colon">：</div>
      <input type="number" name="custom-right" id="custom-right" placeholder="0" min="1" max="9999" />
    </div>
  </div>
</div>
<button class="trans-button" id="run">${strings[uiLang].run}</button>
</form>
</div>
  `;

  panel = document.createElement("div");
  panel.innerHTML = html;

  // 実行
  panel.querySelector("#run").addEventListener("click", changer);

  return panel;
};

// 変更処理
const changer = () => {
  editDocument({ editLabel: "trans object ratio" }, () => {
    
    let basisCheckedValue;
    let orientationCheckedValue;
    let ratioCheckedValue;

    // checked function
    let checkedItem;
    const checkedFn = (name) => {
      const items = panel.querySelectorAll(`input[name=${name}]`);
      items.forEach((item) => {
        if (item.checked) {
          checkedItem = item.value;
        };
      });
      return checkedItem;
    }
    basisCheckedValue = checkedFn('basis');
    orientationCheckedValue = checkedFn('selectOrientation');
    ratioCheckedValue = checkedFn('ratio');

    // value(string) -> figures(number)
    let ratio;
    let num1;
    let num2;
    switch (ratioCheckedValue) {
      case "square":
        num1 = 1;
        num2 = 1;
        break;
      case "golden":
        num1 = 1 + Math.sqrt(5);
        num2 = 2
        break;
      case "yamato":
        num1 = Math.sqrt(2);
        num2 = 1;
        break;
      case "retro":
        num1 = 4;
        num2 = 3;
        break;
      case "camera":
        num1 = 3;
        num2 = 2;
        break;
      case "monitor":
        num1 = 16;
        num2 = 9;
        break;
      case "wide":
        num1 = 16;
        num2 = 10;
        break;
      case "triangle":
        num1 = 2;
        num2 = Math.sqrt(3);
        break;
      default:
        console.log("Select ratio!");
        break;
    }
    
    // orientation landscape or portrait
    if (basisCheckedValue === 'basis-width') {
      if (orientationCheckedValue === 'landscape') {
        ratio = num1 / num2;
      }else if (orientationCheckedValue === 'portrait') {
        ratio = num2 / num1;
      } 
    } else if (basisCheckedValue === 'basis-height') {
      if (orientationCheckedValue === 'landscape') { 
        ratio = num2 / num1;
      }else if (orientationCheckedValue === 'portrait') {
        ratio = num1 / num2;
      } 
    }

    // custom ratio, ratio overwrite
    const left = panel.querySelector('input[name="custom-left"]').value;
    const right = panel.querySelector('input[name="custom-right"]').value;
    if (left > 0 && right > 0) {
      ratio = left / right;
      console.log(ratio); 
    }

    // calc
    selection.items.forEach((item) => {
      const itemWidth = item.localBounds.width;
      const itemHeight = item.localBounds.height;
      if (basisCheckedValue === "basis-width") {
        const transHeight = Math.round(itemWidth / ratio);
        item.resize(itemWidth, transHeight);
      } else if (basisCheckedValue === "basis-height") {
        const transWidth = Math.round(itemHeight / ratio);
        item.resize(transWidth, itemHeight);
      }
    });
  });
};

const show = (event) => {
  if (!panel) event.node.appendChild(create());
};

const update = (selection) => {
  const wrapper = document.querySelector(".wrapper");

  if(selection.items.length === 0) {
    wrapper.classList.add("is-warning");
  } else {
    wrapper.classList.remove("is-warning");
  }
}

module.exports = {
  panels: {
    ratiochanger: {
      show,
      update,
    },
  },
};
