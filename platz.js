var Platz = Platz || (function () {
    function onChildless(element) {
        element.classList.add('platz-childless');

        var placeholder = document.getElementById(element.getAttribute('data-platz-placeholder-id'));

        if (placeholder !== null) {
            placeholder.classList.remove('platz-sleep');
            element.classList.add('platz-childless-with-placeholder');
        }
    }

    function onParent(element) {
        element.classList.remove('platz-childless');
        element.classList.remove('platz-childless-with-placeholder');

        var placeholder = document.getElementById(element.getAttribute('data-platz-placeholder-id'));

        if (placeholder !== null) {
            placeholder.classList.add('platz-sleep');
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
            document.querySelectorAll('*[data-platz-after], *[data-platz-before], *[data-platz-placeholder-id]').forEach(self.register);
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