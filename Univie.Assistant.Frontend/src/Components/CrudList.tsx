import * as React from 'react';
import { CommandBar, DetailsList, IColumn, ICommandBarItemProps, IconButton, SelectionMode, Stack, Selection, IObjectWithKey, IDetailsRowProps } from '@fluentui/react';
import './CrudList.css';
import { getId } from '@fluentui/utilities';
import { QuestionCallout, QuestionCalloutWrapper } from './QuestionCallout';

export interface ICrudListProps<ListEntryType> {
  onKeyRequested: (listEntry: ListEntryType) => string,
  onLoad: () => Promise<ListEntryType[]>,
  onNew: () => void,
  onEdit: (listEntry: ListEntryType) => void,
  onDelete: (listEntry: ListEntryType) => void,
  columns: IColumn[],
};

export interface ICrudListState<ListEntryType> {
  dataSources: ListEntryType[],
};

export class CrudList<ListEntryType> extends React.Component<ICrudListProps<ListEntryType>, ICrudListState<ListEntryType>> {
  private _selection: Selection;
  private _commandBarDeleteButtonId: string;
  private _showCalloutFunc?: () => void;

  constructor(props: ICrudListProps<ListEntryType>) {
    super(props);

    this._selection = new Selection({ onSelectionChanged: this._onItemsSelectionChanged.bind(this) });
    this._commandBarDeleteButtonId = getId('commandBarDeleteButtonId')

    this.state = {
      dataSources: [],
    };
  }

  componentDidMount() {
    this.reloadDatasources();
  }

  private getColumns(): IColumn[] {
    var columns = [... this.props.columns.map(column => {
      column.isRowHeader = true;
      column.isResizable = true;
      column.isPadded = true;
      column.data = 'string';

      return column
    })]

    columns[0].isSorted = true;
    columns[0].onRender = this.renderName.bind(this);
    columns[0].sortAscendingAriaLabel = 'Sorted A to Z';
    columns[0].sortDescendingAriaLabel = 'Sorted Z to A';

    return columns;
  }

  private getCommandBarItems(isItemSelected: boolean): ICommandBarItemProps[] {
    return [
      {
        key: 'newItem',
        text: 'Neu',
        iconProps: { iconName: 'Add' },
        onClick: this.onCommandBarNew.bind(this),
      },
      {
        key: 'edit',
        text: 'Editieren',
        iconProps: { iconName: 'Edit' },
        onClick: this.onCommandBarEdit.bind(this),
        disabled: isItemSelected === false,
      },
      {
        key: 'delete',
        text: 'Löschen',
        iconProps: { iconName: 'Delete' },
        onClick: this.onCommandBarDelete.bind(this),
        disabled: isItemSelected === false,
        id: this._commandBarDeleteButtonId,
      },
    ];
  }

  private onCommandBarNew(): void {
    this.props.onNew();
  }

  private onCommandBarEdit(): void {
    var item = this.state.dataSources.filter(ds => this.props.onKeyRequested(ds) === this._selection.getSelection()[0].key)[0]
    this.editItem(item);
  }

  private onCommandBarDelete(): void {
    if (this._showCalloutFunc)
      this._showCalloutFunc();
  }

  private editItem(listEntry: ListEntryType) {
    this.props.onEdit(listEntry);
  }

  private deleteItem(listEntry: ListEntryType) {
    this.props.onDelete(listEntry);
    var items = [...this.state.dataSources];

    items.forEach((element: ListEntryType, index: number) => {
      if (element === listEntry) items.splice(index, 1);
    });

    this.setState({ dataSources: items });
  }

  private _onItemsSelectionChanged() {
    this.forceUpdate();
  }

  private reloadDatasources() {
    var load = this.props.onLoad();

    load.then(list => {
      this.setState({ dataSources: list });
      this._selection.setItems(list.map(listEntry => { return ({ key: this.props.onKeyRequested(listEntry) } as IObjectWithKey); }), false);
    })
  }

  private isItemSelected(): boolean {
    const selectionCount = this._selection?.getSelectedCount();
    return selectionCount > 0;
  }

  private renderName(listEntry?: ListEntryType, index?: number, column?: IColumn): JSX.Element {
    return (<>
      <Stack horizontal tokens={{ childrenGap: 5 }}>
        <Stack.Item grow={1}>
          <div>{listEntry && (listEntry as any)[column?.fieldName ?? 'name']}</div>
        </Stack.Item>
        <Stack.Item align={'end'}>
          <div className="crud_list_button" style={{ marginTop: -24, marginBottom: -11, display: 'block' }}>
            <IconButton iconProps={{ iconName: 'Edit' }} title="Edit" ariaLabel="Edit" onClick={() => { if (listEntry) this.editItem(listEntry) }} />

            <QuestionCalloutWrapper
              titleText={'Löschen'}
              questionText={'Möchten Sie die Konfiguration wirklich löschen?'}
              okText={'Löschen'}
              cancelText={'Abbrechen'}
              onOkPressed={() => { if (listEntry) this.deleteItem(listEntry) }} >
              <IconButton
                iconProps={{ iconName: 'Delete' }}
                title="Delete"
                ariaLabel="Delete" />
            </QuestionCalloutWrapper>
          </div>
        </Stack.Item>
      </Stack>

    </>)
  }

  render() {
    return (
      <>
        <CommandBar items={this.getCommandBarItems(this.isItemSelected())} />
        <DetailsList
          items={this.state.dataSources}
          columns={this.getColumns()}
          selectionMode={SelectionMode.single}
          selection={this._selection}
          onRenderRow={this.onRenderRow.bind(this)} />

        <QuestionCallout
          titleText={'Löschen'}
          questionText={'Möchten Sie die Konfiguration wirklich löschen?'}
          okText={'Löschen'}
          cancelText={'Abbrechen'}
          onOkPressed={(() => this.deleteItem(this.state.dataSources.filter(ds => this.props.onKeyRequested(ds) === this._selection.getSelection()[0].key)[0])).bind(this)}
          showCallout={((showCalloutFunc: () => void) => { this._showCalloutFunc = showCalloutFunc; }).bind(this)}
          targetId={this._commandBarDeleteButtonId} />
      </>
    )
  }

  private onRenderRow(props?: IDetailsRowProps, defaultRender?: (props?: IDetailsRowProps) => JSX.Element | null): JSX.Element {
    return <>
      <div className="crud_list_row">
        {defaultRender && defaultRender(props)}
      </div>
    </>
  }
}