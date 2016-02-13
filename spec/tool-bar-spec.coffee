describe 'Tool Bar package', ->
  [workspaceElement, toolBarService, toolBarAPI] = []
  getGlyph = (elm) ->
    window.getComputedStyle(elm, ':before')
      .getPropertyValue('content')
      .charCodeAt(1)
      .toString(16)
      .toLowerCase()
  buildClickEvent = ({altKey, ctrlKey, shiftKey}={}) ->
    event = new MouseEvent('click')
    Object.defineProperty(event, 'altKey', get: -> altKey) if altKey?
    Object.defineProperty(event, 'ctrlKey', get: -> ctrlKey) if ctrlKey?
    Object.defineProperty(event, 'shiftKey', get: -> shiftKey) if shiftKey?
    event

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)

    waitsForPromise ->
      atom.packages.activatePackage('tool-bar').then (pack) ->
        toolBarService = pack.mainModule.provideToolBar()

  describe '@activate', ->
    it 'appends only one tool bar', ->
      expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1)
      atom.workspace.getActivePane().splitRight(copyActiveItem: true)
      expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1)

  describe '@deactivate', ->
    it 'removes the tool bar view', ->
      atom.packages.deactivatePackage('tool-bar')
      expect(workspaceElement.querySelector('.tool-bar')).toBeNull()
    it 'notifies on destroy', ->
      toolBarAPI = toolBarService('specs-tool-bar')
      toolBarAPI.onDidDestroy spy = jasmine.createSpy()
      atom.packages.deactivatePackage('tool-bar')
      expect(spy).toHaveBeenCalled()

  describe 'provides a service API', ->
    it 'for others to use', ->
      expect(toolBarService).toBeDefined()
      expect(typeof toolBarService).toBe('function')

    describe 'which can add a button', ->
      [toolBar] = []
      beforeEach ->
        toolBarAPI = toolBarService('specs-tool-bar')
        toolBar = workspaceElement.querySelector('.tool-bar')
      it 'by third-party packages', ->
        expect(toolBarAPI).toBeDefined()
        expect(toolBarAPI.group).toBe('specs-tool-bar')
      it 'with minimum settings', ->
        toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.classList.contains('icon-octoface')).toBe(true)
      it 'with tooltip', ->
        toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
          tooltip: 'About Atom'
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.dataset.originalTitle).toBe('About Atom')

      it 'using default iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
        expect(toolBar.firstChild.classList.contains('icon-octoface')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('f008')
      it 'using Ionicons iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'ionic'
          callback: 'application:about'
          iconset: 'ion'
        expect(toolBar.firstChild.classList.contains('ion')).toBe(true)
        expect(toolBar.firstChild.classList.contains('ion-ionic')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('f14b')
      it 'using Font Awesome iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'fort-awesome'
          callback: 'application:about'
          iconset: 'fa'
        expect(toolBar.firstChild.classList.contains('fa')).toBe(true)
        expect(toolBar.firstChild.classList.contains('fa-fort-awesome')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('f286')
      it 'using Foundation iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'foundation'
          callback: 'application:about'
          iconset: 'fi'
        expect(toolBar.firstChild.classList.contains('fi')).toBe(true)
        expect(toolBar.firstChild.classList.contains('fi-foundation')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('f152')
      it 'using Icomoon iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'IcoMoon'
          callback: 'application:about'
          iconset: 'icomoon'
        expect(toolBar.firstChild.classList.contains('icomoon')).toBe(true)
        expect(toolBar.firstChild.classList.contains('icomoon-IcoMoon')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('eaea')
      it 'using Devicon iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'atom-original'
          callback: 'application:about'
          iconset: 'devicon'
        expect(toolBar.firstChild.classList.contains('devicon')).toBe(true)
        expect(toolBar.firstChild.classList.contains('devicon-atom-original')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('e624')
      it 'using Material Design Icons iconset', ->
        jasmine.attachToDOM(toolBar)
        toolBarAPI.addButton
          icon: 'material-ui'
          callback: 'application:about'
          iconset: 'mdi'
        expect(toolBar.firstChild.classList.contains('mdi')).toBe(true)
        expect(toolBar.firstChild.classList.contains('mdi-material-ui')).toBe(true)
        expect(getGlyph(toolBar.firstChild)).toBe('f449')

      it 'and disabling it', ->
        button = toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
        button.setEnabled(false)
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.classList.contains('disabled')).toBe(true)

      it 'clicking button with command callback', ->
        button = toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
        jasmine.attachToDOM(toolBar)
        atom.commands.onWillDispatch spy = jasmine.createSpy()
        toolBar.firstChild.click()
        expect(spy).toHaveBeenCalled()
        expect(spy.mostRecentCall.args[0].type).toEqual('application:about')
      it 'clicking button with function callback', ->
        button = toolBarAPI.addButton
          icon: 'octoface'
          callback: spy = jasmine.createSpy()
        jasmine.attachToDOM(toolBar)
        toolBar.firstChild.click()
        expect(spy).toHaveBeenCalled()
      it 'clicking button with function callback containing data', ->
        button = toolBarAPI.addButton
          icon: 'octoface'
          callback: spy = jasmine.createSpy()
          data: 'foo'
        toolBar.firstChild.click()
        expect(spy).toHaveBeenCalled()
        expect(spy.mostRecentCall.args[0]).toEqual('foo')
      it 'and restores focus after click', ->
        toolBarAPI.addButton
          icon: 'octoface'
          callback: 'editor:select-line'
          tooltip: 'Select line'
        previouslyFocusedElement = document.activeElement
        toolBar.firstChild.dispatchEvent(new Event('mouseover'))
        toolBar.firstChild.focus()
        toolBar.firstChild.click()
        expect(document.activeElement).toBe(previouslyFocusedElement)

      describe 'by clicking', ->
        it 'stops event bubbling', ->
          clickSpy = jasmine.createSpy()
          toolBar.onclick = clickSpy
          button = toolBarAPI.addButton {}
          button.click()
          expect(clickSpy).not.toHaveBeenCalled()

        describe 'with modifiers', ->
          describe 'and command callback', ->
            spy = null
            beforeEach ->
              toolBarAPI.addButton
                icon: 'octoface'
                callback:
                  '': 'tool-bar:modifier-default'
                  'alt': 'tool-bar:modifier-alt'
                  'ctrl': 'tool-bar:modifier-ctrl'
                  'shift': 'tool-bar:modifier-shift'
                  'shift+alt': 'tool-bar:modifier-shift-alt' # Shouldn't execute
                  'alt+shift': 'tool-bar:modifier-alt-shift' # Last added, should execute
                  'ctrl+shift': 'tool-bar:modifier-ctrl-shift'
                  # 'alt+ctrl': 'tool-bar:modifier-alt-ctrl' # Undefined should return default
                  'alt ctrl-shift': 'tool-bar:modifier-alt-ctrl-shift' # Use any seperator
                jasmine.attachToDOM(toolBar)
                atom.commands.onWillDispatch spy = jasmine.createSpy()
            it 'works without modifiers', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent())
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-default')
            it 'works with alt key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent(altKey: true))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-alt')
            it 'works with ctrl key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent(ctrlKey: true))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-ctrl')
            it 'works with shift key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent(shiftKey: true))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-shift')
            it 'works with alt & shift key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({altKey: true, shiftKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-alt-shift')
            it 'works with ctrl & shift key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({ctrlKey: true, shiftKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-ctrl-shift')
            it 'works with alt & ctrl & shift key', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({altKey: true, ctrlKey: true, shiftKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-alt-ctrl-shift')
            it 'works when modifier callback isn\'t defined', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({altKey: true, ctrlKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-default')
            it 'works with last defined modifiers when there are duplicates', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({altKey: true, shiftKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-alt-shift')
            it 'works with any seperator between modifiers', ->
              toolBar.firstChild.dispatchEvent(buildClickEvent({altKey: true, ctrlKey: true, shiftKey: true}))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0].type).toEqual('tool-bar:modifier-alt-ctrl-shift')
          describe 'and function callback', ->
            it 'executes', ->
              button = toolBarAPI.addButton
                icon: 'octoface'
                callback:
                  '': 'tool-bar:modifier-default'
                  'alt': spy = jasmine.createSpy()
              jasmine.attachToDOM(toolBar)
              toolBar.firstChild.dispatchEvent(buildClickEvent(altKey: true))
              expect(spy).toHaveBeenCalled()
            it 'executes with data', ->
              button = toolBarAPI.addButton
                icon: 'octoface'
                callback:
                  '': 'tool-bar:modifier-default'
                  'alt': spy = jasmine.createSpy()
                data: 'foo'
              toolBar.firstChild.dispatchEvent(buildClickEvent(altKey: true))
              expect(spy).toHaveBeenCalled()
              expect(spy.mostRecentCall.args[0]).toEqual('foo')

    describe 'which can add a spacer', ->
      [toolBar] = []
      beforeEach ->
        toolBarAPI = toolBarService('specs-tool-bar')
        toolBar = workspaceElement.querySelector('.tool-bar')
      it 'with no settings', ->
        toolBarAPI.addSpacer()
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.nodeName).toBe('HR')

  describe 'when tool-bar:toggle is triggered', ->
    it 'hides or shows the tool bar', ->
      atom.commands.dispatch(workspaceElement, 'tool-bar:toggle')
      expect(workspaceElement.querySelector('.tool-bar')).toBeNull()
      atom.commands.dispatch(workspaceElement, 'tool-bar:toggle')
      expect(workspaceElement.querySelectorAll('.tool-bar').length).toBe(1)

  describe 'when tool-bar position is changed', ->
    [topPanelElement, rightPanelElement, bottomPanelElement, leftPanelElement] = []

    beforeEach ->
      topPanelElement = atom.views.getView(atom.workspace.panelContainers.top)
      rightPanelElement = atom.views.getView(atom.workspace.panelContainers.right)
      bottomPanelElement = atom.views.getView(atom.workspace.panelContainers.bottom)
      leftPanelElement = atom.views.getView(atom.workspace.panelContainers.left)

    describe 'by triggering tool-bar:position-top', ->
      it 'the tool bar view is added to top pane', ->
        atom.commands.dispatch(workspaceElement, 'tool-bar:position-top')
        expect(topPanelElement.querySelectorAll('.tool-bar').length).toBe(1)
        expect(rightPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(leftPanelElement.querySelector('.tool-bar')).toBeNull()

    describe 'by triggering tool-bar:position-right', ->
      it 'the tool bar view is added to right pane', ->
        atom.commands.dispatch(workspaceElement, 'tool-bar:position-right')
        expect(topPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(rightPanelElement.querySelectorAll('.tool-bar').length).toBe(1)
        expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(leftPanelElement.querySelector('.tool-bar')).toBeNull()

    describe 'by triggering tool-bar:position-bottom', ->
      it 'the tool bar view is added to bottom pane', ->
        atom.commands.dispatch(workspaceElement, 'tool-bar:position-bottom')
        expect(topPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(rightPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(bottomPanelElement.querySelectorAll('.tool-bar').length).toBe(1)
        expect(leftPanelElement.querySelector('.tool-bar')).toBeNull()

    describe 'by triggering tool-bar:position-left', ->
      it 'the tool bar view is added to left pane', ->
        atom.commands.dispatch(workspaceElement, 'tool-bar:position-left')
        expect(topPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(rightPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(bottomPanelElement.querySelector('.tool-bar')).toBeNull()
        expect(leftPanelElement.querySelectorAll('.tool-bar').length).toBe(1)
