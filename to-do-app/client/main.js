Meteor.subscribe("projects");
Meteor.subscribe("tasks");
Meteor.subscribe("steps");

Session.set("project_id", false);
Session.set("task_id", false);

////////////////////
//////EVENTS////////
////////////////////
Template.projectList.events({
  'click .js-add-project'(event) {
    // adds new project to the collection
    Meteor.call("insertProject");
  }
});

Template.project.events({
  'click .js-delete-project'(event) {
    // deletes the project from the collection
    Session.set("project_id",this._id);
    var project_id = Session.get("project_id");
    Session.set("project_id",false);
    Meteor.call("deleteProject", project_id);
  },
  'click .js-select-project'(event) {
    // selects the project
    Session.set("project_id",this._id);
    $(".js-select-project").removeClass('active');
    var selected = event.currentTarget.id
    $("#" + selected).addClass('active');
    console.log(Session.get("project_id"));
  }
});

Template.taskList.events({
  'click .js-add-task'(event) {
    //adds new task to the collection
    Meteor.call("insertTask", Session.get("project_id"));
  },
  'click .js-delete-task'(event) {
    // deletes the task from the collection
    var task_id = this._id;
    Meteor.call("deleteTask", task_id);
  },
  'click .js-select-task'(event) {
    // selects the task
    Session.set("task_id",this._id);
    $(".js-select-task").removeClass('active');
    var selected = event.currentTarget.id
    $("#" + selected).addClass('active');
    console.log(Session.get("task_id"));
  },
  'click .js-tog-status'(event) {
    Session.set("taskIsFinished", event.target.checked);
    Meteor.call("changeTaskStatus", this, Session.get("taskIsFinished"));
  }
})

Template.stepList.events({
  'click .js-add-step'(event) {
    //adds new step to the collection
    Meteor.call("insertStep", Session.get("project_id"), Session.get("task_id"));
    Meteor.call("checkTaskStatus", Session.get("task_id"));
  },
  'click .js-delete-step'(event) {
    // deletes the step from the collection
    var step_id = this._id;
    Meteor.call("deleteStep", step_id);
    Meteor.call("checkTaskStatus", Session.get("task_id"));
  },
  'click .js-tog-step-status'(event) {
    Session.set("stepIsFinished", event.target.checked);
    Meteor.call("changeStepStatus", this, Session.get("stepIsFinished"));
    Meteor.call("checkTaskStatus", Session.get("task_id"));
  }
})

////////////////////
//////HELPERS///////
////////////////////

Template.main.helpers({
  projectSelected: function(){
    var project = Projects.findOne({_id: Session.get("project_id")});
    if(project){
      return true;
    }
    return false;
  },
  taskSelected: function(){
    var task = Tasks.findOne({_id: Session.get("task_id")});
    if(task){
      return true;
    }
    return false;
  }
});

Template.projectList.helpers({
  areProjects: function() {
    if(Projects.find({owner: Meteor.user()._id}).count()){
      return true;
    }
    return false;
  },
  projects: function(){
    return Projects.find({owner: Meteor.user()._id})
  }
});

Template.project.helpers({
  totalTasks: function(){
    return Tasks.find().count()
  },
  projectTasks: function(){
    return Tasks.find({project: this._id}).count()
  },
  finishedTasks: function(){
    return Tasks.find({project: this._id, isFinished: true}).count()
  },
  progressTask: function(){
    var total, finished, progress;
    total = Tasks.find({project: this._id}).count();
    finished = Tasks.find({project: this._id, isFinished: true}).count();
    progress = 100/total*finished;
    if(progress){
      return progress;
    }
    return 0;
  }
});

Template.taskHeader.helpers({
  title: function(){
    var project = Projects.findOne({_id: Session.get("project_id")});
    if(project){
      return project.title;
    }
    return "";
  }
});

Template.taskList.helpers({
  areTasks: function() {
    if(Tasks.find({project: Session.get("project_id")}).count()) {
      return true;
    }
    return false;
  },
  //shows tasks of selected project
  tasks: function(){
    if(Session.get("project_id")){
      return Tasks.find({project: Session.get("project_id")},
      //{sort: {isFinished: 1}}
    )}
  }
});

Template.task.helpers({
  totalSteps: function(){
    return Steps.find().count()
  },
  taskSteps: function(){
    return Steps.find({task: this._id}).count()
  },
  finishedSteps: function(){
    return Steps.find({task: this._id, isFinished: true}).count()
  },
  progressSteps: function(){
    var total, finished, progress;
    total = Steps.find({task: this._id}).count();
    finished = Steps.find({task: this._id, isFinished: true}).count();
    progress = 100/total*finished;
    if(progress){
      return progress;
    }
    return 0;
  }
});

Template.stepHeader.helpers({
  title: function(){
    var task = Tasks.findOne({_id: Session.get("task_id")});
    if(task){
      return task.title;
    }
    return "";
  }
});

Template.stepList.helpers({
  areSteps: function(){
    if(Steps.find({task: Session.get("task_id")}).count()){
      return true;
    }
    return false;
  },
  steps: function(){
    if(Session.get("task_id")){
      return Steps.find({task: Session.get("task_id")}, 
      //{sort: {isFinished: 1}}
    )}
  }
});


//animation of adding projects
// Template.projectList.rendered = function() {
//   AnimatedEach.attachHooks(this.find(".list-group"));
// };


Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 100, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#ccc', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    //top: 'auto', // Top position relative to parent in px
    //left: 'auto' // Left position relative to parent in px
};