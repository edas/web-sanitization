const CSSwhat = require("css-what")
const fs = require('fs')
const path = require('path')

validateAll()

function displayErrors(errors) {
  errors.forEach( error => console.warn(...error) )
}

function validateAll() {
  const errors = validateAllConsent()
  displayErrors(errors)
  process.exit( errors.length )
}

function pushErrors(accumulator, errors) {
  accumulator.push(...errors)
}

function validateAllConsent() {
  const root = 'consent-o-matic'
  const rootDir = path.join('.', 'src', root)
  const files = fs.readdirSync(rootDir)
  const stack = [ 'consent-o-matic' ]
  const  errors = [ ]
  files.forEach(file => {
    const filePath = path.join(rootDir, file)
    errors.push( ...validConsentFile(filePath, stack) )
  })
  return errors
}


function validConsentFile(file, stack) {
  try {
    const content = fs.readFileSync(file)
    const data = JSON.parse(content)
    return validConsentJSON(data, [...stack, file])
  } catch(e) {
    return [['Error in reading JSON file', [...stack, file], e]]
  }
}

function validConsentJSON(data, stack) {
  const actionTypes = {
    click: validClickAction,
    list:  validListAction,
    consent: validConsentAction,
    slide: validSlideAction,
    ifcss: validIfcssAction,
    waitcss: validWaitcssAction,
    foreach: validForeachAction,
    hide: validHideAction,
    close: validCloseAction
  }

  const errors = [ ]
  Object.keys(data).forEach(key => {
    errors.push( ...validSection(data[key], [...stack, key]) )
  })
  return errors

  function validSection(data, stack) {
    return ensureHas(data, {
      detectors: validDetectors,
      methods: validMethods
    }, {}, stack)
  }  

  function validDetectors(data, stack) {
    return ensureArray(data, validDetector, stack) 
  }

  function validDetector(data, stack) {
    return ensureHas(data, {
      presentMatcher: validMatcher,
      showingMatcher: validMatcher
    }, {}, stack)
  }

  function validMatcher(data, stack) {
    return ensureHas(data, {
      type: validMatcherType,
      target: validTarget
    }, {
      parent: validTarget
    }, stack)
  }

  function validMatcherType(data, stack) {
    return ensureOneOf(data, ['css', 'checkbox'], stack)
  }

  function validTarget(data, stack) {
    return ensureHas(data, {
      selector: validSelector
    }, {
      textFilter: validTextFilter,
      styleFilter: validStyleFilter,
      displayFilter: validDisplayFilter,
      iframeFilter: validIframeFilter,
      childFilter: validChildFilter
    }, stack)
  }

  function validDisplayFilter(data, stack) {
    return ensureBoolean(data, stack)
  }

  function validSelector(data, stack) {
    return ensureSelector(data, stack)
  }

  function validTextFilter(data, stack) {
    if (Array.isArray(data)) {
      return ensureArray(data, ensureString, stack)
    } else {
      return ensureString(data, stack)
    }
  }

  function validStyleFilter(data, stack) {
    return ensureHas(data, {
      option: validStyleOption,
      value: validStyleValue
    }, {
      negated: validNegated
    }, stack)
  }

  function validStyleOption(data, stack) {
    return ensureString(data, stack)
  }

  function validStyleValue(data, stack) {
    return ensureString(data, stack) 
  }

  function validNegated(data, stack) {
    return ensureBoolean(data, stack) 
  }

  function validIframeFilter(data, stack) {
    return ensureBoolean(data, stack) 
  }

  function validChildFilter(data, stack) {
    return ensureHas(data, {
      target: validTarget
    }, {}, stack)
  }

  function validMethods(data, stack) {
    return ensureArray(data, validMethod, stack) 
  }

  function validMethod(data, stack) {
    return ensureHas(data, {
      name: validName,
      action: validAction
    }, {}, stack)
  }
  r
  function validName(data, stack)  {
    return ensureOneOf(data, ['OPEN_OPTIONS', 'DO_CONSENT', 'SAVE_CONSENT'], stack)
  }

  function validAction(data, stack) { 
    const errors = validActionType(data.type, [...stack, 'type'])
    if (errors.length === 0) {
      return actionTypes[data.type](data, stack)
    } else {
      return errors
    }
  }

  function validActionType(data, stack) {
    return ensureOneOf(data, Object.keys(actionTypes), stack)
  }

  function validClickAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget
    }, {
      description: validDescription,
      parent: validTarget
    }, stack)
  }

  function validListAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      actions: validActions
    }, {
      description: validDescription
    }, stack)
  }

  function validActions(data, stack) {
    return ensureArray(data, validAction, stack)
  }

  function validSlideAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget,
      dragTarget: validDragTarget,
      axis: validAxis
    }, {
      description: validDescription
    }, stack)
  }

  function validDragTarget(data, stack) {
    return ensureHas(data, {
      target: validTarget
    }, {
      parent: validTarget
    }, stack)
  }

  function validAxis(data, stack) {
    return ensureOneOf(data, ['x', 'y'], stack)
  }

  function validIfcssAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget
    }, {
      description: validDescription,
      parent: validTarget,
      trueAction: validAction,
      falseAction: validAction
    }, stack)
  }

  function validWaitcssAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget
    }, {
      description: validDescription,
      parent: validTarget,
      numRetries: validRetries,
      retries: validRetries,
      waitTime: validWaitTime,
      negated: validNegated
    }, stack)
  }

  function validRetries(data, stack) {
    return ensureNumber(data, stack)
  }

  function validWaitTime(data, stack) {
    return ensureNumber(data, stack)
  }

  function validForeachAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget
    }, {
      parent: validTarget,
      action: validAction
    }, stack)
  }

  function validHideAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      target: validTarget
    }, {
      description: validDescription,
      parent: validTarget
    }, stack)
  }

  function validCloseAction(data, stack) {
    return ensureHas(data, {
      type: validActionType
    }, { 
      description: validDescription
    }, stack)
  }

  function validConsentAction(data, stack) {
    return ensureHas(data, {
      type: validActionType,
      consents: validConsents
    }, { 
      description: validDescription
    }, stack)
  }

  function validConsents(data, stack) {
    return ensureArray(data, validConsent, stack)
  }

  function validConsent(data, stack) {
    return ensureHas(data, {
      type: validConsentType,
    }, {
      description: validDescription,
      toggleAction: validAction,
      matcher: validMatcher,
      trueAction: validAction,
      falseAction: validAction
    }, stack)
  }

  function validDescription(data, stack) {
    return ensureString(data, stack)
  }

  function validConsentType(data, stack) {
    return ensureOneOf(data, ['A', 'B', 'D', 'E', 'F', 'X'], stack)
  } 

  function ensureHas(data, required, optional, stack) {
    const errors = [ ]
    try {
      Object.keys(required).forEach( key => {
        if (!data.hasOwnProperty(key) || data[key]===null || data[key]===undefined) {
          errors.push([`Missing ${key}`, stack])
        }
      })
      Object.keys(data).forEach( key => {
        if (data[key]===null || data[key]===undefined) return
        const subStack = [...stack, key]
        const val = data[key]
        if (required.hasOwnProperty(key)) {
          const validator = required[key]
          const subErrors = validator(val, subStack)
          errors.push( ...subErrors )
        } else if (optional) {
          if (optional.hasOwnProperty(key)) {
            const validator = optional[key]
            const subErrors = validator(val, subStack)
            errors.push( ...subErrors )
          } else {
            errors.push([`Unknown property '${key}'`, stack])
          }
        }
      })
    } catch(e) {
      errors.push(['Error in analyze', stack, data, required, optional])
    }
    return errors
  }

  function ensureArray(data, validation, stack) {
    const errors = [ ]
    if (!Array.isArray(data)) {
      errors.push( ['Not an array', stack] )
    } else {
      data.forEach( (val, idx) => {
        errors.push(...validation(val, [...stack, idx]))
      })
    }
    return errors
  }

  function ensureOneOf(data, list, stack) {
    const errors = [ ]
    if (!list.includes(data)) {
      errors.push( [ `Unknown value '${data}'`, stack, data])
    }
    return errors
  }

  function ensureSelector(data, stack) {
    const errors = ensureString(data, stack)
    if (errors.length ===  0) {
      try {
        CSSwhat.parse(data)
      } catch (e) {
        console.warn("ouch", data, e)
        errors.push(['Invalid css selector', stack, data, e])
      }
    }
    return errors
  }

  function ensureString(data, stack) {
    const errors = [ ]
    if ('string' !== typeof data) {
      errors.push(['Not a string', stack, data])
    }
    return errors
  }

  function ensureBoolean(data, stack) {
    const errors = [ ]
    if ('boolean' !== typeof data) {
      errors.push(['Not a boolean', stack, data])
    }
    return errors
  }

  function ensureNumber(data, stack) {
    const errors = [ ]
    if ('number' !== typeof data) {
      errors.push(['Not a number', stack, data])
    }
    return errors
  }

}