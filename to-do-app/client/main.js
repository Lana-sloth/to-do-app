
////////////////////
//////ROUTER////////
////////////////////

// Router.configure({
//   layoutTemplate: "ApplicationLayout"
// });

// Router.route('/', function () {
//   this.render('navbar', {to: "navbar"});
//   this.render('projectList', {to: "projects"});
// });

// Router.route('/tasks', function () {
//   this.render('navbar', {to: "navbar"});
//   this.render('projectList', {to: "projects"});
//   this.render('taskList', {to: "tasks"});
// });

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
    // deletes the project from the collection
    var task_id = this._id;
    Meteor.call("deleteTask", task_id);
  },
  'click .js-select-task'(event) {
    // selects the task
  },
  'click .js-tog-status'(event) {
    Session.set("taskIsFinished", event.target.checked);
    Meteor.call("changeTaskStatus", this, Session.get("taskIsFinished"));
  }
})

////////////////////
//////HELPERS///////
////////////////////
Template.taskHeader.helpers({
  title: function(){
    var project = Projects.findOne({_id: Session.get("project_id")});
    if(project){
      return project.title;
    }
    else {
      return "";
    }
  }
});

Template.main.helpers({
  projectSelected: function(){
    var project = Projects.findOne({_id: Session.get("project_id")});
    if(project){
      return true;
    }
    else {
      return false;
    }
  }
});

Template.projectList.helpers({
  projects: function(){
    return Projects.find({
      owner: Meteor.user()._id
    })
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
  }
});

Template.taskList.helpers({
  tasks: function(){
    if(Session.get("project_id")){
      return Tasks.find({
        project: Session.get("project_id")
      })
    }
  }
});

Template.main.rendered = function() {
  Session.set("project_id", false);
}

//animation of adding projects
Template.projectList.rendered = function() {
    AnimatedEach.attachHooks(this.find(".list-group"));
};

//chart in projectList template
Template.projectList.helpers({
  topGenresChart: function() {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,

            backgroundColor: null,

            spacingBottom: 0,
            spacingTop: -15,
            spacingLeft: 0,
            spacingRight: 0,
            width: 80,
            height: 80
        },
        title: {
            text: ""
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: '',
                dataLabels: {
                    enabled: false,
                    format: '{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        colors: ['#337ab7','#ffffff'],
        series: [{
            type: 'pie',
            name: 'tasks',
            data: [
                ['Done',   70],
                ['Undone', 30]
            ]
        }]
    };
  }
})