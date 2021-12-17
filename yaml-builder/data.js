const data = {
  exposes: {
    doorbell: {
      style: {
        'brightness': '100%',
        'color-name': 'blue'
      }
    },
    circadian: {
      style: {
        'color-temperature': '$circadian-temp',
        'brightness': '$circadian-bri'
      }
    },
    theater: {
      style: {
        'brightness': '$volume-controlled',
        'color-name': 'orange'
      }
    }
  },

  lights: {
    "living_room": {
      exposes: [
        'doorbell',
        'theater',
        'circadian'
      ]
    }
  },

  variables: {
    '$circadian-temp': {
      type: 'kelvin',
      range: ['2700', '6500']
    },
    '$circadian-bri': {
      type: 'percentage'
    },
    '$volume-controlled': {
      type: 'percentage'
    }
  }
}

module.exports = data