# Concepts

WFNG orchestrates workflows. The hierarchy of workflow parts is: Process --> Task --> Step. A Process is a loose collection of unordered Tasks. A Task is an ordered collection of Steps.

## Tasks

Tasks have a Starter Step, which dictates how the Task is initiated. This may be an API-based trigger or a time/cron event. The execution of a Task is linear in the sense that a Step is performed after the previous Step; multiple Steps cannot run in parallel in a single Task instance. However, multiple Task instances may run simultaneously. A Task is complete when either the final Step in the task has been completed, or a Step has instructed the Task to halt (for example, in case of a critical error). Parallelism options are defined on a per-Task basis.

## Steps

A Step may be one of several types: Starter, Synchronous, or Asynchronous. The initial Step of any Task must be of the Starter type. This type can optionally have a timing component a la cron, and it always has an API-based trigger component. Synchronous Steps, as the name implies, are performed synchronously: the runtime executes the Synchronous Step and, upon completion, considers the Step to have been executed, moving on to the next step (if any). Asynchronous Steps, however, are designed more for extremely long-running executions. The Asynchronous Step provides an API endpoint to its executable and then waits for that API endpoint to be called with appropriate data to indicate that the Step has completed. Only then will the next Step, if any, execute.

Starter Steps have an optional scripting component, which aids in determining whether to proceed with starting the Task. Synchronous and Asynchronous Steps have a mandatory scripting component that is essentially the definition of the work for the Step.

## Processes

A Process is analogous to a directory or folder. It contains one or more Tasks, and it allows for logical grouping of Tasks. Processes are an optional component of workflows; there is an implicit "default" Process always present for ungrouped Tasks.

## Successes, Failures, Warnings, Timeouts, and Keep-Alives

Tasks and Steps have statuses. If a Step fails, by default, its parent Task will also fail. For reporting flexibility purposes, a Warning status is possible as well. By default, every Step has a timeout, which will mark the Step as failed if it does not complete before the timeout. The timeout value can be changed or even disabled (this is not recommended). For Asynchronous Steps, the provided API endpoint can be used to tell WFNG that the work is still proceeding (a keep-alive message). Asynchronous Steps have a normal Timeout, which can be reset by the keep-alive messages, as well as a fail-safe timeout, which will still mark the Step as failed regardless of keep-alive messages (if enabled).

# The Concept of a Step

The Step is what performs the "real" work in workflows. Every Step has metadata attached to it, which defines things like step type, timeouts, connections to other steps, and calls to other Tasks.

## Metadata

Step metadata is defined separately from scripting because it needs to be processed statically for verification, reporting, and visualization purposes. This places some limitations on the scripting for much the same reasons. For example, calling a Task that is not defined in the metadata is not allowed. However, there are workarounds to support more complicated scenarios, at the expense of diminished WFNG-native management.

## Scripting API

Step scripting is powered by JavaScript. The API allows, among other things, HTTP/HTTPS calls, executing shell commands and applications, and calling other Tasks.

## Inter-Step Connections

For scripting and visualization purposes, every Step has a single entry point. An API call, a timer, or another Step might call this entry point; it will have data indicating such information. Steps may have multiple exit points defined. There is always an implicit exit point for halting the current Task. Additionally, there may be one or more exit points for calling other Tasks and for moving on to one (but only one!) of any number of possible next Steps.

## Data Sharing

Data can be shared between calling APIs, Steps, and Tasks. A Starter Step can read data from its entry point, which may include API information or arbitrary data. Other Steps can similarly read data from their entry points. Step exit points allow the passing of arbitrary data to the next Step or to other Tasks.

For more advanced scenarios, arbitrary data can be persisted on a per-Step, per-Task, and per-Process basis, as well as per instances of running Tasks.

# Security

As a lightweight application, WFNG does not support the concept of users or granular permissions natively. However, provisions exist to assist with certain aspects of security. All modifications are tracked in an audit log, which includes HTTP headers sent by the clients performing the modifications. It is recommended to use a reverse proxy, such as nginx, to provide HTTPS connectivity and, optionally, user authentication.

Using an authentication server (e.g., Authelia) in conjunction with nginx, it is possible to set up various scenarios, such as:
- requiring all users to authenticate for read and write access
- separating read access from write access using different permissions
- allowing unauthenticated users read access, while requiring authentication for write access

The above scenarios can be implemented by selectively allowing or denying access to various WFNG endpoints and/or HTTP verbs.

As an application with the ability to execute arbitrary code (and shell commands), WFNG should never be run in an untrusted environment.
