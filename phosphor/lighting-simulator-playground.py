#!/usr/bin/env python

import asyncio
from asyncio.tasks import sleep
import websockets
import time


colors = [
  "pink",
  "yellow",
  "cyan",
  "magenta"
]

async def hello(websocket, path):
    name = await websocket.recv()
    for color in colors:
      await websocket.send(color)
      await asyncio.sleep(2)
    # print("< {}".format(name))
    # greeting = "Hello {}!".format(name)
    # print("> {}".format(greeting))

start_server = websockets.serve(hello, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()