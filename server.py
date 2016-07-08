#!/usr/bin/python
# -*- coding:utf-8 -*-


import SimpleHTTPServer
import webbrowser

if __name__ == "__main__":
    SimpleHTTPServer.test()

    url = "http://localhost:8000"
    webbrowser.open(url)


