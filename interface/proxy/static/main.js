(function() {
  $.ajax({
    method: "POST",
    url: "/api/login",
    data: {info: "I'm doing something"},
    success: function(data) {
      console.log(data)
    },
    error: function(err) {
      console.log(err)
    }
  })
})()
