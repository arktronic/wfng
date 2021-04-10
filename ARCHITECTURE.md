# Concepts

WFNG orchestrates workflows. The hierarchy of workflow parts is: Process --> Task --> Step. A Process is a loose collection of unordered Tasks. A Task is an ordered collection of Steps.

## Tasks

Tasks have a Starter Step, which dictates how the Task is initiated. This may be an API-based trigger or a time/cron event. The execution of a Task is linear in the sense that a Step is performed after the previous Step; multiple Steps cannot run in parallel in a single Task instance. However, multiple Task instances may run simultaneously. A Task is complete when either the final Step in the task has been completed, or a Step has instructed the Task to halt (for example, in case of a critical error). Parallelism options are defined on a per-Task basis.

## Steps

A Step may be one of several types: Starter, Synchronous, or Asynchronous. The initial Step of any Task must be of the Starter type. This type can optionally have a timing component a la cron, and it always has an API-based trigger component. Synchronous Steps, as the name implies, are performed synchronously: the runtime executes the Synchronous Step and, upon completion, considers the Step to have been executed, moving on to the next step (if any). Asynchronous Steps, however, are designed more for extremely long-running executions. The Asynchronous Step provides an API endpoint to its executable and then waits for that API endpoint to be called with appropriate data to indicate that the Step has completed. Only then will the next Step, if any, execute.

Starter Steps have an optional scripting component, which aids in determining whether to proceed with starting the Task. Synchronous and Asynchronous Steps have a mandatory scripting component that is essentially the definition of the Step itself.

## Processes

A Process is analogous to a directory or folder. It contains one or more Tasks, and it allows for logical grouping of Tasks. Processes are an optional component of workflows; there is an implicit "default" Process always present for ungrouped Tasks.

## Successes, Failures, Warnings, Timeouts, and Keep-Alives

Tasks and Steps have statuses. If a Step fails, by default, its parent Task will also fail. For reporting flexibility purposes, a Warning status is possible as well. By default, every Step has a timeout, which will mark the Step as failed if it does not complete before the timeout. The timeout value can be changed or even disabled (this is not recommended). For Asynchronous Steps, the provided API endpoint can be used to tell WFNG that the work is still proceeding (a keep-alive message). Asynchronous Steps have a normal Timeout, which can be reset by the keep-alive messages, as well as a fail-safe timeout, which will still mark the Step as failed regardless of keep-alive messages (if enabled).

# The Concept of a Step

## Metadata

## Scripting API

## Inter-Step Connections

## Data Sharing
