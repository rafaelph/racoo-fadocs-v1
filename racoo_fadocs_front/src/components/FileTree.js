import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DescriptionIcon from '@material-ui/icons/Description';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import DocumentCart from './DocumentCart';
import Checkbox from '@material-ui/core/Checkbox';

const useTreeItemStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { key, file, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, onFileSelected, ...other } = props;
    console.log('File', file)

    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <Checkbox
                        id={`checkbox-${key}`}
                        checked={file.checked}
                        onChange={(e, checked) => onFileSelected(file.id, checked)}
                        onClick={e => (e.stopPropagation())}
                    />
                    <LabelIcon color="inherit" className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                selected: classes.selected,
                group: classes.group,
                label: classes.label,
            }}
            {...other}
        />
    );
}

StyledTreeItem.propTypes = {
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.string,
    labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export default function FileTree({ files, onSelectFolder, onFileSelected }) {
    const classes = useStyles();

    const handleFileClick = (file) => {
        if (file.mimeType.includes('folder')) {
            onSelectFolder(file.id)
        }
    }

    const renderTree = (file) => {
        return (
            <StyledTreeItem
                file={file}
                key={file.id}
                nodeId={file.id}
                labelText={file.name}
                labelIcon={file.mimeType.includes('folder') ? FolderIcon : DescriptionIcon}
                onClick={() => handleFileClick(file)}
                // onContextMenu={($event) => handleFileRightClick($event, file)}
                onFileSelected={onFileSelected}
            >
                {Array.isArray(file.children) ? file.children.map((file) => renderTree(file)) : null}
            </StyledTreeItem>
        )
    };

    return (
        <Row>
            <Col sm={10}>
                <TreeView
                    multiSelect
                    className={classes.root}
                    defaultCollapseIcon={<FolderIcon />}
                    defaultExpandIcon={<FolderOpenIcon />}
                    defaultEndIcon={<div style={{ width: 24 }} />}
                >
                    {files.map(file => renderTree(file))}
                </TreeView>
            </Col>
            <Col sm={2}>
                <DocumentCart />
            </Col>
        </Row>
    );
}
