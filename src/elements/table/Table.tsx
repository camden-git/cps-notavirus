import React from 'react';
import styles from './styles.module.css';
import classNames from 'classnames';

const Table = (props: { children?: React.ReactNode; className?: string }) => {
    return <table className={classNames(styles.table, props.className)}>{props.children}</table>;
};

export default Table;
