package database

import (
        "context"
        "fmt"

        "github.com/hashicorp/vault/helper/consts"
        "github.com/hashicorp/vault/logical"
        "github.com/hashicorp/vault/logical/framework"
)

func (b *databaseBackend) walRollback(ctx context.Context, req *logical.Request, kind string, data interface{}) error {
        walRollbackMap := map[string]framework.WALRollbackFunc{
                "setcreds": b.pathCredentialRollback,
        }

        if !b.System().LocalMount() && b.System().ReplicationState().HasState(consts.ReplicationPerformanceSecondary|consts.ReplicationPerformanceStandby) {
                return nil
        }

        f, ok := walRollbackMap[kind]
        if !ok {
                return fmt.Errorf("unknown type to rollback")
        }

        return f(ctx, req, kind, data)
}
