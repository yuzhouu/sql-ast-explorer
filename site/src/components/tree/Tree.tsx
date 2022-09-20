import { Fragment } from "react"
import classNames from 'classnames'

interface Props {
    tree: Record<string, any>
}

function renderChild(key: string, value:any, depth: number = 0) {
    if (typeof value === 'object') {
        const keys = Object.keys(value)
        const isArray = Array.isArray(value)
        return <div>
                    <div>
                        <span>+/-</span>
                        <span>{key}</span>
                        <span>{isArray ? '[':'{'}</span>
                    </div>

                    <div className={classNames(`depth-${depth}`)}>
                       {
                            keys.map(childKey => {
                                return <Fragment key={childKey}>
                                    {renderChild(childKey, value[childKey])}
                                </Fragment>
                            })
                       }
                    </div>

                    <div><span>{isArray ? ']':'}'}</span></div>
                </div>
    } 

    return <div>
        <span>{key}</span><span>:</span><span>{value}</span>
    </div>
}

export default function Tree({tree}: Props) {
    const keys = Object.keys(tree)
    return keys.map(childKey => {
        return <Fragment key={childKey}>
            {renderChild(childKey, tree[childKey])}
        </Fragment>
    })
}