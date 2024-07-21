import {type Page} from 'puppeteer';
import {type GlobalThis} from 'type-fest';

declare const page: Page;

describe('offsetTop, offsetLeft, offsetParent tests in real browser', () => {
  type TestResults = {
    ponyfill: {
      target1: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
      target2: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
      target3: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
    };
    native: {
      target1: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
      target2: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
      target3: {
        offsetTop: number;
        offsetLeft: number;
        offsetParent: {
          tagName: string;
          id: string;
        };
      };
    };
  };

  let ponyfill: TestResults['ponyfill'];
  let native: TestResults['native'];

  beforeAll(async () => {
    await page.addScriptTag({
      path: './node_modules/@floating-ui/utils/dom/floating-ui.utils.dom.umd.js',
    });

    await page.addScriptTag({
      path: './dist/composed-offset-position.umd.js',
    });

    await page.setContent(`
      <!DOCTYPE html>
      <style>
        .box {
          width: 10px;
          height: 10px;
        }
      </style>
    
      <div>
        <template shadowroot="open">
          <style>
            .box {
              width: 10px;
              height: 10px;
            }
          </style>
          <div class="box"></div>
          <div id="target1shadow" style="position: relative">
            <div class="box"></div>
            <slot></slot>
          </div>
        </template>
        <div class="box"></div>
        <div id="target1" style="position: absolute" class="box"></div>
      </div>
    
      <span>
        <template shadowroot="open">
          <style>
            .box {
              width: 10px;
              height: 10px;
            }
          </style>
          <span class="box"></span>
          <span id="target2shadow" style="position: relative">
            <span class="box"></span>
            <slot></slot>
          </span>
        </template>
        <span class="box"></span>
        <span id="target2" style="position: absolute" class="box"></span>
      </span>
    
      <div>
        <template shadowroot="open">
          <style>
            .box {
              width: 10px;
              height: 10px;
            }
          </style>
          <div class="box"></div>
          <div id="target3shadowouter" style="position: relative">
            <div class="box"></div>
            <div>
              <template shadowroot="open">
                <style>
                  .box {
                    width: 10px;
                    height: 10px;
                  }
                </style>
                <div class="box"></div>
                <div id="target3shadowinner" style="position: relative">
                  <div class="box"></div>
                  <slot></slot>
                </div>
              </template>
              <slot></slot>
            </div>
          </div>
        </template>
        <div class="box"></div>
        <div id="target3" style="position: absolute" class="box"></div>
      </div>
    
      <script>
        const { offsetLeft, offsetTop, offsetParent } = window.ComposedOffsetPosition;      
      
        (function attachShadowRoots(root) {
          root.querySelectorAll("template[shadowroot]").forEach((template) => {
            const mode = template.getAttribute("shadowroot");
            const shadowRoot = template.parentNode.attachShadow({ mode });
            shadowRoot.append(template.content);
            template.remove();
            attachShadowRoots(shadowRoot);
          });
        })(document);

        window.testResults = { 
          ponyfill: {
            target1: {
              offsetTop: offsetTop(target1),
              offsetLeft: offsetLeft(target1),
              offsetParent: {
                tagName: offsetParent(target1)?.tagName,
                id: offsetParent(target1)?.id
              }
            },
            target2: {
              offsetTop: offsetTop(target2),
              offsetLeft: offsetLeft(target2),
              offsetParent: {
                tagName: offsetParent(target2)?.tagName,
                id: offsetParent(target2)?.id
              }
            },
            target3: {
              offsetTop: offsetTop(target3),
              offsetLeft: offsetLeft(target3),
              offsetParent: {
                tagName: offsetParent(target3)?.tagName,
                id: offsetParent(target3)?.id
              }
            },
          },
        native: {
            target1: {
              offsetTop: target1.offsetTop,
              offsetLeft: target1.offsetLeft,
              offsetParent: {
                tagName: target1.offsetParent.tagName,
                id: target1.offsetParent.id
              }
            },
            target2: {
              offsetTop: target2.offsetTop,
              offsetLeft: target2.offsetLeft,
              offsetParent: {
                tagName: target2.offsetParent.tagName,
                id: target2.offsetParent.id
              }
            },
            target3: {
              offsetTop: target3.offsetTop,
              offsetLeft: target3.offsetLeft,
              offsetParent: {
                tagName: target3.offsetParent.tagName,
                id: target3.offsetParent.id
              }
            }
          }
        };
      </script>
    `);

    type TestWindow = GlobalThis & {
      testResults: TestResults;
    };

    const results = await page.evaluate(
      () => (globalThis as TestWindow).testResults,
    );

    ponyfill = results.ponyfill;
    native = results.native;
  });

  test('offsetLeft', async () => {
    expect(ponyfill.target1.offsetLeft).toBe(0);
    expect(ponyfill.target2.offsetLeft).toBe(0);
    expect(ponyfill.target3.offsetLeft).toBe(0);

    expect(native.target1.offsetLeft).toBe(8);
    expect(native.target2.offsetLeft).toBe(8);
    expect(native.target3.offsetLeft).toBe(8);
  });

  test('offsetTop', async () => {
    expect(ponyfill.target1.offsetTop).toBe(20);
    expect(ponyfill.target2.offsetTop).toBe(0);
    expect(ponyfill.target3.offsetTop).toBe(20);

    expect(native.target1.offsetTop).toBe(38);
    expect(native.target2.offsetTop).toBe(38);
    expect(native.target3.offsetTop).toBe(88);
  });

  test('offsetParent', async () => {
    expect(ponyfill.target1.offsetParent.tagName).toBe('DIV');
    expect(ponyfill.target1.offsetParent.id).toBe('target1shadow');
    expect(ponyfill.target2.offsetParent.tagName).toBe('SPAN');
    expect(ponyfill.target2.offsetParent.id).toBe('target2shadow');
    expect(ponyfill.target3.offsetParent.tagName).toBe('DIV');
    expect(ponyfill.target3.offsetParent.id).toBe('target3shadowinner');

    expect(native.target1.offsetParent.tagName).toBe('BODY');
    expect(native.target2.offsetParent.tagName).toBe('BODY');
    expect(native.target3.offsetParent.tagName).toBe('BODY');
  });
});
