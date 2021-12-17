const yaml = require('yaml')
const fs = require('fs')

const data = require('./data')

const ID_PREFIX = 'phosphor'
const ALIAS_PREFIX = 'Phosphor:'

function getInputNumberId(variable) {
  return `${ID_PREFIX}_var_${variable.replace('$', '').replace('-', '_')}`
}

const phosphorPackage = {
  input_number: {},
  input_boolean: {},
  input_select: {},
  script: {},
  automation: {}
}

function handleExposes() {





}

function main(phosphorPackage) {



  Object.entries(data.variables).forEach(([variable, options]) => {

    let min
    let max
    switch (options.type) {
      case 'percentage':
        min = 0; max = 100;
        break;
      case 'kelvin':
        if (options.range) {
          min = 2700
          max = 6500
        }
        break;

      default:
        break;
    }
    phosphorPackage.input_number[getInputNumberId(variable)] = {
      name: 'Slider',
      min,
      max,
      step: 1
    }
  })

  const getExposeChangeAutomationId = (exposeId) => `handle_expose_change_${exposeId}`

  Object.entries(data.exposes).forEach(([exposeId, value]) => {
    phosphorPackage.input_boolean[`${ID_PREFIX}_expose_${exposeId}`] = { name: `${ALIAS_PREFIX} ${exposeId} status` }

    phosphorPackage.automation[`handle_expose_change_${exposeId}`] = {
      alias: "New Automation",
      // "description": "",
      "trigger": [
        {
          platform: "state",
          entity_id: getExposeChangeAutomationId(exposeId)
        }
      ],
      // "condition": [

      // ],
      "action": [
        // {
        //   "service": "script.phosphor_update_expose_light_living_room"
        // }
      ],
      "mode": "single",
    }
  })

  const getExposeInputSelectId = (light) => `${ID_PREFIX}_expose_light_${light}`
  const getSetExposeToLightScriptId = (light, exposeId) => `${ID_PREFIX}_set_light_${light}_expose_${exposeId}`

  Object.entries(data.lights).forEach(([light, { exposes }]) => {
    phosphorPackage.input_select[getExposeInputSelectId(light)] = {
      name: `${ALIAS_PREFIX} ${light} light expose`,
      options: exposes
    }
    phosphorPackage.script[`${ID_PREFIX}_update_expose_light_${light}`] = {
      alias: `Phosphor: update the input select for ${light} expose`.replace('_', ' '),
      sequence: [
        {
          choose: exposes.map((exposeId) => {
            const exposeData = data.exposes[exposeId]
            phosphorPackage.script[getSetExposeToLightScriptId(light, exposeId)] = {
              alias: `${ALIAS_PREFIX} set ${light} to expose ${exposeId}`,
              sequence: [
                {
                  condition: 'state',
                  entity_id: `input_select.${getExposeInputSelectId(light)}`,
                  state: exposeId
                },
                {
                  service: "light.turn_on",
                  target: {
                    entity_id: `light.${light}`
                  },
                  data: Object.entries(exposeData.style).reduce((style, [prop, value]) => {
                    const isVariable = value.includes('$')
                    const isPercentage = value.includes('%')

                    if (isVariable) {
                      value = `{{ input_number.${getInputNumberId(value)} | int }}`
                    }

                    switch (prop) {
                      case 'brightness':
                        if (isPercentage) {
                          prop = prop + '_pct'
                          value = value.replace('%', '')
                        }
                        break;
                      case 'color-name':
                        prop = 'color_name'
                        break;

                      case 'color-temperature':
                        prop = 'color_temp'
                        break;

                      default:
                        break;
                    }
                    Object.assign(style, { [prop]: value })
                    return style
                  }, {})
                }
              ],
              mode: "single"
            }

            phosphorPackage.automation[getExposeChangeAutomationId(exposeId)].action.push({
              service: `script.${getSetExposeToLightScriptId(light, exposeId)}`
            })

            return {
              conditions: [
                {
                  condition: "state",
                  entity_id: `input_boolean.phosphor_expose_${exposeId}`,
                  state: 'on'
                }
              ],
              sequence: [
                {
                  service: "input_select.select_option",
                  target: {
                    entity_id: `input_select.phosphor_expose_light_${light}`
                  },
                  data: {
                    option: exposeId
                  }
                }
              ]
            }
          })
        }
      ]
    }
  })



  // console.log(phosphorPackage)

}

main(phosphorPackage)








const yamlConfig = yaml.stringify(phosphorPackage).replaceAll(" on", " 'on'")

fs.writeFileSync('./phosphor.yaml', yamlConfig)