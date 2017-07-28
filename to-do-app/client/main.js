Template.projectList.helpers({projects: Projects.find()});

Template.projectList.events({
  'click .js-add-project'(event) {
    // adds new project to the collection
    Projects.insert({
      title: "New project",
      totalTasks: 0,
      completedTasks: 0
    });
  },
  'click .js-delete-project'(event) {
    // adds new project to the collection
    var project_id = this._id;
    $("#"+project_id).fadeOut("slow", function(){
      Projects.remove({"_id":project_id});
    })
  }
});

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