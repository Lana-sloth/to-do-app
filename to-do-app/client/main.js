////////////////////
//////ROUTER////////
////////////////////

Router.configure({
  layoutTemplate: "ApplicationLayout"
});

Router.route('/', function () {
  this.render('navbar', {to: "navbar"});
  this.render('projectList', {to: "projects"});
});

Router.route('/tasks', function () {
  this.render('navbar', {to: "navbar"});
  this.render('projectList', {to: "projects"});
  this.render('taskList', {to: "tasks"});
});

////////////////////
//////EVENTS////////
////////////////////
Template.projectList.events({
  'click .js-add-project'(event) {
    // adds new project to the collection
    Projects.insert({
      title: "New project",
      totalTasks: 10,
      finishedTasks: 3,
      unfinishedTasks: 10 - 3
    });
  },
  'click .js-delete-project'(event) {
    // deletes the project from the collection
    var project_id = this._id;
    $("#"+project_id).fadeOut("slow", function(){
      Projects.remove({"_id":project_id});
    })
  },
  'click .js-select-project'(event) {
    // selects the project
    Session.set("project_id",this._id);
    Session.set("project_selected",true);
    console.log(Session.get("project_id"));
  }
});

Template.taskList.events({
    'click .js-add-task'(event) {
    //adds new task to the collection
    Tasks.insert({
      title: "New task",
      project: Session.get("project_id")
    });
  },
  'click .js-delete-task'(event) {
    // deletes the project from the collection
    var task_id = this._id;
    $("#"+task_id).fadeOut("slow", function(){
      Tasks.remove({"_id":task_id});
    })
  },
  'click .js-select-task'(event) {
    // selects the project
    console.log(this.project);
  }
})

////////////////////
//////HELPERS///////
////////////////////

Template.projectList.helpers({
  projects: Projects.find()
});

Template.taskList.helpers({
  tasks: function(){
    if(Session.get("project_id")){
      return Tasks.find({project: Session.get("project_id")})
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