var Placeholder = Placeholder || (function () {
    function onChildless(element) {
        element.classList.add('placeholderjs-childless');

        var placeholder = document.getElementById(element.getAttribute('data-placeholderjs-placeholder-id'));

        if (placeholder !== null) {
            placeholder.classList.remove('placeholderjs-sleep');
            element.classList.add('placeholderjs-childless-with-placeholder');
        }
    }

    function onParent(element) {
        element.classList.remove('placeholderjs-childless');
        element.classList.remove('placeholderjs-childless-with-placeholder');

        var placeholder = document.getElementById(element.getAttribute('data-placeholderjs-placeholder-id'));

        if (placeholder !== null) {
            placeholder.classList.add('placeholderjs-sleep');
        }
    }

    function hasChildrenBranch(element, hooks) {
        if (hasChildren(element)) {
            onParent(element);

            if (hooks && hooks.onParent) {
                hooks.onParent(element);
            }
        } else {
            onChildless(element);

            if (hooks && hooks.onChildless) {
                hooks.onChildless(element);
            }
        }
    }

    function hasChildren(parent) {
        var children = parent.childNodes;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
                return true;
            }
        }

        return false;
    }

    var self = {
        init: function () {
            document.querySelectorAll('*[data-placeholderjs-after], *[data-placeholderjs-before], *[data-placeholderjs-placeholder-id]').forEach(self.register);
        },

        register: function (element, hooks) {
            new MutationObserver(function (mutations, observer) {
                hasChildrenBranch(mutations[0].target, hooks);
            }).observe(element, {
                childList: true
            });

            hasChildrenBranch(element, hooks);
        }
    };

    return self;
})();