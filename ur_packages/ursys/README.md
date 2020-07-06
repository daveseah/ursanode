# URSYS

URSYS is the utility system used by many of my projects. It implements the following at this time as a server-side and client-side library.

* message brokering system, using messages and subscribers *between* web apps. It also implements *asynchronous remote message calls* across the network.
* phased lifecycle management for controlling *application runtime* in discrete phases of operation. Can also be used to implement things like gameloops.
* various utilities, etc

The long term goal for URSYS is to provide a complete support framework for implementing and debugging realtime interactive application in the browser.
