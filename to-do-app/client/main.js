
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
    Meteor.call("deleteProject", Session.get("project_id"));
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
    Session.set("allTasksCount", Tasks.find().count());
    Meteor.call("insertTask", Session.get("project_id"));
  },
  'click .js-delete-task'(event) {
    // deletes the project from the collection
    var task_id = this._id;
    Session.set("allTasksCount", Tasks.find().count());
    Meteor.call("deleteTask", task_id);
  },
  'click .js-select-task'(event) {
    // selects the project
    console.log(this.project);
  }
})

////////////////////
//////HELPERS///////
////////////////////
Template.taskHeader.helpers({
  title: function(){
    // if(Session.get("project_id")){
    //   return Projects.findOne({_id:Session.get("project_id")}).title
    // }
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
    if(!Session.get("allTasksCount")) {
      return Tasks.find().count()
    }
    else{
      return Session.get("allTasksCount")
    }
  }
});

Template.taskList.helpers({
  tasks: function(){
    if(Session.get("project_id")){
      return Tasks.find({
        project: Session.get("project_id")
      })
    }
  },
  projectSelected: function(){
    if(Session.get("project_id")){
      return true
    }
  }
});


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