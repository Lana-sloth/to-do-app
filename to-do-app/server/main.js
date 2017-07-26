Meteor.startup(() => {
  // code to run on server at startup
  // if there are no projects, add one
  if(!Projects.findOne()){
    Projects.insert({
      title: "Project 1",
      totalTasks: 0,
      completedTasks: 0
    });
    Projects.insert({
      title: "Project 2",
      totalTasks: 0,
      completedTasks: 0
    });
    Projects.insert({
      title: "Project 3",
      totalTasks: 0,
      completedTasks: 0
    });
  }
});
