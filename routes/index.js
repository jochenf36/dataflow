
/*
 * GET home page.
 */

exports.index = function(req, res){


    var templateLinks = new Array(); // will hold the links of all the available templates

    // Templatelinks prototype
    function Templatelink(name, link)
    {
        this.name = name;
        this.link = link;
    }

    var tourguide = new Templatelink("Tour Guide", "/tourguideTemplate");

    templateLinks.push(tourguide);

  res.render('index', { templateLinks: templateLinks });

};
