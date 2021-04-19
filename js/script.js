

{
  'use strict';
  /*
  document.getElementById('test-button').addEventListener('click', function(){
    const links = document.querySelectorAll('.titles a');
  });
  */

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };


  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optAuthorListSelector = '.authors',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optCloudAuthorClassPrefix = 'author-size-';

  function generateTitleLinks(customSelector = ''){
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* [DONE] find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';
    for(let article of articles){
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element */
      /* [DONE] get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* [DONE] create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* [DONE] insert link into html variable */
      html = html + linkHTML;
    } //end for

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  } //end generateTitleLinks()

  generateTitleLinks();

  generateTags();

  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-','');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let tagLink of tagLinks){
      /* remove class active */
      tagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagHrefs = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagHref of tagHrefs){
      /* add class active */
      tagHref.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll('a[href^="#tag-"]');
    //const links = document.querySelectorAll('a[href="'+ href + '"]');
    /* START LOOP: for each link */
    for (let link of links){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    /* [DONE] find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /*find and authors list*/
    const authorList = document.querySelector(optAuthorListSelector);

    let allAuthors = {};

    /* [DONE] START LOOP: for every article: */
    for(let article of articles){
      /* [DONE] find authors wrapper */
      const author = article.getAttribute('data-author');
      if(!allAuthors[author]) {
      /* [NEW] add tag to allTags object */
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }      /* END LOOP: for every article: */

    const authorsParams = calculateTagsParams(allAuthors);
    //let allAuthorsHTML = '';
const allAuthorsData = {authors: []};

    for(let author in allAuthors){
      //allAuthorsHTML += '<li><a href="#author-' + author + '" class="' + calculateAuthorClass(allAuthors[author], authorsParams) + '"><span>' + author + '</span></a></li>';
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorsParams)
      });
    }

    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }

  generateAuthors();

  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#author-','');
    /* find all author links*/
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each author link */
    for (let authorLink of authorLinks){
      /* remove class active */
      authorLink.classList.remove('active');
    /* END LOOP: for each author link */
    }
    /* add class active */
    clickedElement.classList.add('active');
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    /* find all links to authors */
    const links = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each link */
    for (let link of links){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  }
  addClickListenersToAuthors();

  function calculateTagsParams(allTags){
    let params = {};
    for (let tag in allTags){
      if(!params['min']){
        params['min'] = allTags[tag];
        params['max'] = allTags[tag];
      }else{
        if(allTags[tag] > params['max']){
          params['max'] = allTags[tag];
        }
        if(allTags[tag] < params['min']){
          params['min'] = allTags[tag];
        }
      }
    }
    return params;
  }

  function calculateTagClass(count, params){
    const classNumber = Math.floor((count-params.min)/(params.max-params.min) * (optCloudClassCount - 1) + 1 );
    return (optCloudClassPrefix + classNumber);
  }
  function calculateAuthorClass(count, params){
    const classNumber = Math.floor((count-params.min)/(params.max-params.min) * (optCloudClassCount - 1) + 1 );
    return (optCloudAuthorClassPrefix + classNumber);
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles){
      /* find tags wrapper */
      const tagsWrappers = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray){
        /* generate HTML of the link */
        //const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        /* [DONE] add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsWrappers.innerHTML = html;
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    //    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    //let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"><span>' + tag + ' </span></a></li>';
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log('allTagsData: ', allTagsData);
  }
}
