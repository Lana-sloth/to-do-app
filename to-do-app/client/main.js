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