function __placeholderjs_onChildless(element) {
    element.classList.add('placeholderjs-childless');

    var placeholder = document.getElementById(element.getAttribute('data-placeholderjs-placeholder-id'));

    if (placeholder !== null) {
        placeholder.classList.remove('placeholderjs-sleep');
        element.classList.add('placeholderjs-childless-with-placeholder');
    }
}

function __placeholderjs_onParent(element) {
    element.classList.remove('placeholderjs-childless');
    element.classList.remove('placeholderjs-childless-with-placeholder');

    var placeholder = document.getElementById(element.getAttribute('data-placeholderjs-placeholder-id'));

    if (placeholder !== null) {
        placeholder.classList.add('placeholderjs-sleep');
    }
}

var __placeholderjs_observer = new MutationObserver(function(mutations, observer) {
    __placeholderjs_hasChildrenBranch(mutations[0].target);
});

var __placeholderjs_observerConfig = { childList: true }

function placeholderjs_init() {
    document.querySelectorAll('*[data-placeholderjs-after], *[data-placeholderjs-before], *[data-placeholderjs-placeholder-id]').forEach(placeholderjs_register);
}

function placeholderjs_register(element) {
    __placeholderjs_observer.observe(element, __placeholderjs_observerConfig);
    __placeholderjs_hasChildrenBranch(element);
}

function __placeholderjs_hasChildrenBranch(element) {
    if (__placeholderjs_hasChildren(element)) {
        __placeholderjs_onParent(element);
    } else {
        __placeholderjs_onChildless(element);
    }
}

function __placeholderjs_hasChildren(parent) {
    var children = parent.childNodes;

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            return true;
        }
    }

    return false;
}
