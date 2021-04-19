{
  'use strict';

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
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');
    const activeArticles = document.querySelectorAll('article.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }
    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
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
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  generateTags();

  function tagClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-','');
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let tagLink of tagLinks){
      tagLink.classList.remove('active');
    }
    const tagHrefs = document.querySelectorAll('a[href="' + href + '"]');
    for (let tagHref of tagHrefs){
      tagHref.classList.add('active');
    }
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    const links = document.querySelectorAll('a[href^="#tag-"]');
    for (let link of links){
      link.addEventListener('click', tagClickHandler);
    }
  }

  addClickListenersToTags();

  function generateAuthors(){
    const articles = document.querySelectorAll(optArticleSelector);
    const authorList = document.querySelector(optAuthorListSelector);
    let allAuthors = {};
    for(let article of articles){
      const author = article.getAttribute('data-author');
      if(!allAuthors[author]) {
        allAuthors[author] = 1;
      } else {
        allAuthors[author]++;
      }
    }
    const authorsParams = calculateTagsParams(allAuthors);
    const allAuthorsData = {authors: []};
    for(let author in allAuthors){
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
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-','');
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for (let authorLink of authorLinks){
      authorLink.classList.remove('active');
    }
    clickedElement.classList.add('active');
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    const links = document.querySelectorAll('a[href^="#author-"]');
    for (let link of links){
      link.addEventListener('click', authorClickHandler);
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
    let allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles){
      const tagsWrappers = article.querySelector(optArticleTagsSelector);
      let html = '';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');
      for (let tag of articleTagsArray){
        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        html = html + linkHTML;
        if(!allTags[tag]) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      tagsWrappers.innerHTML = html;
    }
    const tagList = document.querySelector(optTagsListSelector);
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }
}
