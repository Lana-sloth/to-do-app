Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
  insertProject: function(){
    // adds the project to the collection
    Projects.insert({
      title: "New project",
      owner: Meteor.user()._id
    });
  },
  deleteProject: function(project_id) {
    // deletes the project from the collection
    Projects.remove({_id: project_id});
    Tasks.remove({project: project_id});
  },
  insertTask: function(project_id){
    // adds the task to the collection
    Tasks.insert({
      title: "New task",
      isFinished: false,
      project: project_id
    });
  },
  deleteTask: function(task_id) {
    // deletes the task from the collection
    Tasks.remove({_id:task_id});
  },
  changeTaskStatus: function(task, taskStatus) {
    var updatedTask = Tasks.findOne({_id: task._id});
    updatedTask.isFinished = taskStatus;
    Tasks.update({_id: task._id}, updatedTask);
  }
})