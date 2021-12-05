import store

import json


def main():
  config = json.load(open('config.json', 'r'))
  print(config)
  store.store()

main()