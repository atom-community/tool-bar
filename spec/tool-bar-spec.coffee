describe 'Tool Bar package', ->
  [workspaceElement, toolBarService, toolBarAPI] = []

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
          tooltip: 'About Atom'
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.classList.contains('icon-octoface')).toBe(true)
        expect(toolBar.firstChild.dataset.originalTitle).toBe('About Atom')
      it 'using custom icon set (Ionicons)', ->
        toolBarAPI.addButton
          icon: 'gear-a'
          callback: 'application:show-settings'
          tooltip: 'Show Settings'
          iconset: 'ion'
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.classList.contains('ion')).toBe(true)
        expect(toolBar.firstChild.classList.contains('ion-gear-a')).toBe(true)
        expect(toolBar.firstChild.dataset.originalTitle).toBe('Show Settings')
      it 'and disabling it', ->
        button = toolBarAPI.addButton
          icon: 'octoface'
          callback: 'application:about'
          tooltip: 'About Atom'
        button.setEnabled(false)
        expect(toolBar.children.length).toBe(1)
        expect(toolBar.firstChild.classList.contains('disabled')).toBe(true)

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
