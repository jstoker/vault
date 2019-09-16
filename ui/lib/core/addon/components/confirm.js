import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import layout from '../templates/components/confirm';
import { next } from '@ember/runloop';

/**
 * @module Confirm
 * `Confirm` components prevent users from performing actions they do not intend to by showing a confirmation message as an overlay. This is a contextual component that should always be rendered with a `Message` which triggers the message.
 *
 * @example
 * ```js
 * <div class="box">
 * <Confirm as |c|>
 *   <c.Message
 *     @id={{item.id}}
 *     @triggerText="Delete"
 *     @message="This will permanently delete this secret and all its versions."
 *     @onConfirm={{action "delete" item "secret"}}
 *     />
 * </Confirm>
 * </div>
 * ```
 */

export default Component.extend({
  layout,
  openTrigger: null,
  height: 0,
  focusTrigger: null,
  style: computed('height', function() {
    return htmlSafe(`height: ${this.height}px`);
  }),
  wormholeReference: null,
  wormholeId: computed(function() {
    return `confirm-${this.elementId}`;
  }),
  didInsertElement() {
    this.set('wormholeReference', this.element.querySelector(`#${this.wormholeId}`));
  },
  didRender() {
    this.updateHeight();
  },
  updateHeight: function() {
    let height;
    height = this.openTrigger
      ? this.element.querySelector('.confirm-overlay').clientHeight
      : this.element.querySelector('.confirm').clientHeight;
    this.set('height', height);
  },
  actions: {
    onTrigger: function(itemId, e) {
      this.set('openTrigger', itemId);

      // store a reference to the trigger so we can focus the element
      // after clicking cancel
      this.set('focusTrigger', e.target);
      this.updateHeight();
    },
    onCancel: function() {
      this.set('openTrigger', '');
      this.updateHeight();

      next(() => {
        this.focusTrigger.focus();
        this.set('focusTrigger', null);
      });
    },
  },
});
