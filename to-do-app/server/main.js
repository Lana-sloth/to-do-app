Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.publish("projects", function(){
  return Projects.find({owner: Meteor.user()._id});
})

Meteor.publish("tasks", function(){
  return Tasks.find({owner: Meteor.user()._id});
})

Meteor.publish("steps", function(){
  return Steps.find({owner: Meteor.user()._id});
})

///////////////////
///// METHODS /////
///////////////////

Meteor.methods({
  insertProject: function(){
    // adds the project to the collection
    Projects.insert({
      title: "New project",
      owner: Meteor.user()._id
    });
  },
  deleteProject: function(project_id) {
    // deletes the project, its tasks and the task's steps from the collection
    Projects.remove({_id: project_id});
    Tasks.remove({project: project_id});
    Steps.remove({project: project_id});
  },
  insertTask: function(project_id){
    // adds the task to the collection
    Tasks.insert({
      title: "New task",
      isFinished: false,
      project: project_id,
      owner: Meteor.user()._id
    });
  },
  deleteTask: function(task_id) {
    // deletes the task and its steps from the collection
    Tasks.remove({_id:task_id});
    Steps.remove({task: task_id});
  },
  changeTaskStatus: function(task, taskStatus) {
    // changes task status to show if it's finished or not
    var updatedTask = Tasks.findOne({_id: task._id});
    updatedTask.isFinished = taskStatus;
    Tasks.update({_id: task._id}, updatedTask);
  },
  insertStep: function(project_id, task_id){
    // adds the task's step to the collection
    Steps.insert({
      title: "New step",
      isFinished: false,
      project: project_id,
      task: task_id,
      owner: Meteor.user()._id
    });
  },
  deleteStep: function(step_id) {
    // deletes the step from the collection
    Steps.remove({_id:step_id});
  },
  changeStepStatus: function(step, stepStatus) {
    // changes task's step status to show if it's finished or not
    var updatedStep;
    updatedStep = Steps.findOne({_id: step._id});
    updatedStep.isFinished = stepStatus;
    Steps.update({_id: step._id}, updatedStep);

  },
  checkTaskStatus: function(task_id) {
    var stepsOfSelected, finishedStepsOfSelected, selectedTask;
    stepsOfSelected = Steps.find({task: task_id}).count();
    finishedStepsOfSelected = Steps.find({task: task_id, isFinished: true}).count();
    selectedTask = Tasks.findOne({_id: task_id});
    
    if(stepsOfSelected == finishedStepsOfSelected){
      selectedTask.isFinished = true;
    }
    else {
      selectedTask.isFinished = false;
    }
    Tasks.update({_id: task_id}, selectedTask);
  }
})