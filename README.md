# frontend-challenge react.js

PURPOSE

The purpose of this challenge is to test your ability to:
- Replicate a design using html/css/react
- Create basic react components and shared components
- Work with 3rd party components (Bryntum Scheduler)
- Handle drag/drop events, object handling and user interaction

Watch the video for a completed version of this challenge: https://www.loom.com/share/a947af8cd6a44f2fa87db5638b0bb5c8


GETTING STARTED

To get started, you'll need to clone this repo to your local PC and run these files on a PHP web server. Make sure PHP is installed and you can use the following command to run the web server: "php -S localhost:8000". Once it's running, access the url with "/docs" on the end (such as http://localhost:8000/docs) as this will bypass the "Trial Expiry" limitation. Refer to the below 2 tasks for this challenge. After you have completed your work, upload it to your github account and provide us the link to the repo.


TASK 1 - Create Side Panel (UI slicing)

- Refer to "design.png" and create the side panel as react components
- Use CSS to stylise all elements exactly like the design
- Add a hover effect for the tasks (you determine the hover style)


TASK 2 - Implement Drag & Drop (Development)

- Using the side panel you created in Task 1, allow the user to drag a task from the panel onto the scheduler board (in Bryntum these are called events)
- Refer to this example to see how the drag feature should work from a panel onto the scheduler https://www.bryntum.com/examples/scheduler/dragfromgrid/. You will also find the zipped source code files for the drag demo contained with this repo "dragfromgrid.zip" which you can refer to
- Leverage Bryntum's existing classes and helpers to achieve the outcome


TIP: Bryntum's dragfromgrid demo uses the unplanned grid component which will not be used in this challenge. Once the task is dropped, be sure to use the SchedulerEventModel class and define the basic properties before the task is added to the eventStore, like this:

let droppedTask = new SchedulerEventModel({
    'startDate': ...,
    'durationUnit': ...,
    'duration': ...,
    'name': ...
});
droppedTask.resource  = context.resource;
